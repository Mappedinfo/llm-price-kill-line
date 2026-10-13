import { DATA } from '../data/models.js';

export const FX = DATA.meta.fx;
export const BLENDED_W = { cache: 0.7, in: 0.2, out: 0.1 };
/** 混合口径:均衡 = AA 7:2:1;重度 agent = 编码代理真实账单结构(real-api-pricing 同款 97:2.5:0.5) */
export const MIXES = {
  std:   { cache: 0.7,   in: 0.2,   out: 0.1 },
  agent: { cache: 0.97,  in: 0.025, out: 0.005 },
};
export const mixW = (mix) => MIXES[mix] || MIXES.std;
const MIN_P = 0.028; // 免费点钉在轴最左侧

/** 混合价(原币种);blendedOverride 用于 AA 市场均价口径(不随口径切换) */
export function nativePrice(o, basis, mix = 'std') {
  if (basis === 'in') return o.pIn ?? null;
  if (basis === 'out') return o.pOut ?? null;
  if (o.blendedOverride != null) return o.blendedOverride;
  const c = o.pCache != null ? o.pCache : o.pIn;
  if (o.pIn == null || o.pOut == null) return null;
  const w = mixW(mix);
  return w.cache * c + w.in * o.pIn + w.out * o.pOut;
}
export const toUsd = (v, cur) => (cur === 'CNY' ? v / FX : v);

const _rowsCache = {};
export function getRows(mix = 'std') {
  if (_rowsCache[mix]) return _rowsCache[mix];
  const w = mixW(mix);
  const rows = DATA.offerings.map((o) => ({
    ...o,
    blendedUsd:
      o.blendedOverride != null
        ? o.blendedOverride
        : (() => { const n = nativePrice(o, 'blended', mix); return n == null ? null : toUsd(n, o.cur); })(),
    price(basis) {
      const v = nativePrice(o, basis, mix);
      return v == null ? null : toUsd(v, o.cur);
    },
    avgRawUsd:
      o.pIn == null || o.pOut == null ? null : (o.pIn + (o.pCache ?? o.pIn) + o.pOut) / 3,
    _w: w,
  }));
  _rowsCache[mix] = rows;
  return rows;
}

/**
 * 订阅量化点:真实单价 = 月费 ÷ 月可用 tokens(混合口径切换时重算)
 * - usd 额度:可买 tokens = 额度 ÷ 混合价;real = 月费 ÷ tokens
 * - yi 实测(raw tokens):按 raw 均价与混合价的比例折算为混合 token 等效
 * - credits:credits/1M(mix) = Σ w×系数×100;tokens = 额度 ÷ 该值
 */
export function getSubsPoints(mix = 'std') {
  const w = mixW(mix);
  return DATA.subs
    .map((sp) => {
      const blended = w.cache * sp.p.cache + w.in * sp.p.in + w.out * sp.p.out; // $/1M 混合
      const avgRaw = (sp.p.in + sp.p.cache + sp.p.out) / 3;
      let tokensM = null; // 每月可用的「混合 token」百万数
      if (sp.allowance.usd != null) {
        tokensM = sp.allowance.usd / blended;
      } else if (sp.allowance.yi != null) {
        const rawM = sp.allowance.yi * 100; // 亿 → 百万
        tokensM = rawM * (avgRaw / blended);
      } else if (sp.allowance.credits != null) {
        const perM = (w.in * sp.allowance.f.in + w.cache * sp.allowance.f.cache + w.out * sp.allowance.f.out) * 100;
        tokensM = sp.allowance.credits / perM;
      }
      if (tokensM == null || !isFinite(tokensM) || tokensM <= 0) return null;
      const real = sp.feeUsd ?? parseFloat(sp.plan.match(/\$([\d.]+)/)?.[1] ?? '0');
      return {
        ...sp,
        blended,
        tokensM,
        real: real / tokensM,
        feeUsd: real,
      };
    })
    .filter(Boolean);
}

/** 帕累托前沿:按价格升序扫描,能力分创出新高者存活。免费限量不参与。 */
export function computeFrontier(rows, basis) {
  const pts = rows
    .filter((r) => r.ch !== 'free' && r.price(basis) != null && r.ii != null)
    .map((r) => ({ r, p: r.price(basis) }))
    .sort((a, b) => a.p - b.p || b.r.ii - a.r.ii);
  let best = -1;
  const frontier = [];
  for (const pt of pts) {
    if (pt.r.ii > best) { best = pt.r.ii; frontier.push(pt); }
  }
  const fIds = new Set(frontier.map((f) => f.r.id));
  const dominated = new Set();
  for (const r of rows) {
    if (r.ch === 'free' || fIds.has(r.id)) continue;
    const p = r.price(basis);
    if (p == null || r.ii == null) continue;
    const killed = pts.some((q) => q.r.id !== r.id && q.p <= p * 1.0001 && q.r.ii >= r.ii);
    if (killed) dominated.add(r.id);
  }
  return { frontier, fIds, dominated };
}

/** 通用帕累托前沿(x=price, y=ii) */
export function frontierOf(points) {
  const pts = points.filter((p) => p.real != null && p.ii != null).sort((a, b) => a.real - b.real || b.ii - a.ii);
  let best = -1;
  const out = [];
  for (const p of pts) {
    if (p.ii > best) { best = p.ii; out.push(p); }
  }
  const fIds = new Set(out.map((p) => p.id));
  const dominated = new Set(
    points.filter(
      (p) =>
        !fIds.has(p.id) &&
        p.real != null && p.ii != null &&
        points.some((q) => q.id !== p.id && q.real <= p.real * 1.0001 && q.ii >= p.ii)
    ).map((p) => p.id)
  );
  return { frontier: out.map((p) => ({ r: p, p: p.real })), fIds, dominated };
}

/** 同模型跨渠道价差分组(用于渠道价差面板) */
export function spreadGroups() {
  const rows = getRows().filter((r) => r.ii != null && !r.dep && r.blendedUsd != null);
  const g = {};
  for (const r of rows) (g[r.model] = g[r.model] || []).push(r);
  return Object.entries(g)
    .filter(([, rs]) => rs.length >= 2)
    .map(([model, rs]) => ({
      model,
      vendor: rs[0].vendor,
      items: rs.map((r) => ({ r, p: r.blendedUsd })).sort((a, b) => a.p - b.p),
      min: Math.min(...rs.map((r) => r.blendedUsd)),
      max: Math.max(...rs.map((r) => r.blendedUsd)),
    }))
    .sort((a, b) => b.max / b.min - a.max / a.min);
}

/** 性价比榜(能力分>=45 的在售模型) */
export function valueBoard() {
  return getRows()
    .filter((r) => r.ii != null && r.ii >= 45 && !r.dep && r.blendedUsd != null && r.ch !== 'free')
    .map((r) => ({ r, v: r.ii / r.blendedUsd }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 15);
}

/* ---- 订阅方案英文摘要(按 DATA.plans 下标对齐;fee/note 缺省沿用原文) ---- */
export const PLAN_EN = [
  { quota: 'Full GPT-5.6 family (Sol/Terra/Luna), 54K instant / 256K reasoning context, "limits apply".' },
  { quota: '$200 tier unlocks Sol Pro with 128K/400K context and "unlimited*" Sol/Terra/Luna under reasonable-use policy.' },
  { quota: 'Premium seats get 5× usage with no 5-hour cap.' },
  { fee: 'Pay-as-you-go', quota: '1 credit = $0.01. Codex rate works out near API price ×2.5-4 discount for Sol usage.', note: 'per learn.chatgpt.com' },
  { quota: 'Rolling 5-hour window (≥5× free tier) plus weekly caps; Claude Code included.' },
  { quota: '5×/20× Pro usage; 20× includes Fable 5 access; overflow billed as API-rate credits.' },
  { quota: '4× Gemini access priority, 1M context, $10 cloud credit.' },
  { quota: '5×/20× Pro-tier usage, Deep Think, Project Genie.' },
  { quota: 'Grok 4.6 with higher rate limits and Expert mode.' },
  { quota: 'Plus: advanced usage + 1080p video; Heavy: highest limits + early features ($300/mo media-reported).' },
  { quota: '≈80/400/1600 prompts per 5h and 400/2000/8000 weekly; restricted to designated tools incl. Claude Code.' },
  { quota: '2,000/12,000/28,000 credits per 5h (10k/60k/140k weekly). GLM-5.3 factors: in 6.9 / cache 1.7 / out 24 pts per 10k tokens; 50% off off-peak. Vendor claims up to 92% saving vs metered API.', note: 'monthly fees are media-reported; official docs publish only credits' },
  { quota: 'Same credit structure as CN; supports Claude Code/Cline/OpenCode.' },
  { quota: 'Agent quotas 60/150/360/720 runs; Vivace exclusively gets K3 million-token chats.' },
  { quota: 'New CN subscriptions paused since 2026-07-19 due to K3 capacity; Kimi Code shares the member pool; add-on packs from ¥25.' },
  { quota: '2,500/10,000/40,000 credits per 7 days; night half-price on qwen3.8-max & DeepSeek V4 Pro (22:00-08:00); top-up pack ¥100=20,000 credits; model factors not published.' },
  { quota: '5h + weekly windows covering M3/M2.7/image/audio; credit packs ¥7 per 1,000 (par-value); overflow billed at list via credits.' },
  {},
  { quota: 'Pro 1,500 AI credits/mo (≈$15 value); Pro+ 7,000; Max 20,000; model picker spans Claude/GPT/Gemini/Grok/Kimi.' },
  { quota: 'Pro bundles an in-house model pool (incl. Grok 4.6); third-party models billed at API price postpaid (+$0.25/M on Teams).' },
  { quota: 'Monthly credits 50/1,000/2,000/5,000/10,000 at $0-$200; add-ons $0.04/credit; free tier covers open-weight models.' },
  { quota: 'Pro 2,000 ACU/mo; Max 10,000 ACU/mo; legacy Windsurf pricing page now redirects to Devin.' },
];

export const MECH_EN = [
  'Prepaid credits (Stripe cards +5.5%, crypto 5%, AliPay); BYOK free under $25k/mo list then 5%; :free variants 50–1,000 req/day; :batch always 50% off.',
  'Prepaid from $20 with auto-reload; card fee 4.4%+$0.30 per purchase; tokens at cost — price drops pass through.',
  'Peak/off-peak double-price model: off-peak costs exactly half of peak (peak = weekday daytime Beijing time).',
  'Batch is a flat 50% off; OpenAI also offers Flex at 50% while Priority/Fast cost 2×.',
  'Credits deduct at 50% off off-peak (peak = weekdays 14:00–18:00 UTC+8 only); hard stop when exhausted; tool-restricted (Claude Code/OpenCode etc.).',
  'M3 standard tier is “permanently 50% off”; >512K-context portion doubles; priority tier ×1.5.',
];

export { DATA };
