import React, { useMemo, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';
import { DATA, nativePrice } from '../lib/dataset.js';
import { fmtMoney, fmtNative, hexA } from '../lib/format.js';
import useSize from './useSize.js';

const MIN_X = 0.03, MAX_X = 20;
const Y_MIN = 25, Y_MAX = 66;
const FREE_PIN = 0.032;
const X_TICKS = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20];

export default function KillLineChart({ rows, basis, labelsOn, focusOn }) {
  const { t } = useI18n();
  const [ref, width] = useSize();
  const [hover, setHover] = useState(null); // 恒为 null 或 {pt},结构单一化避免取值歧义

  const H = 640;
  const M = { top: 22, right: 30, bottom: 56, left: 60 };
  const innerW = Math.max(width - M.left - M.right, 300);
  const innerH = H - M.top - M.bottom;

  const lx = (v) =>
    M.left +
    ((Math.log10(Math.max(v, MIN_X)) - Math.log10(MIN_X)) / (Math.log10(MAX_X) - Math.log10(MIN_X))) * innerW;
  const ly = (ii) => M.top + (Y_MAX - Math.min(Math.max(ii, Y_MIN), Y_MAX)) / (Y_MAX - Y_MIN) * innerH;

  // 组装点位
  const pts = useMemo(() => {
    const out = [];
    for (const r of rows) {
      let p = r.price(basis);
      const isFree = r.ch === 'free';
      if (p == null || p <= 0) p = isFree ? FREE_PIN : null;
      if (p == null || r.ii == null) continue;
      out.push({
        id: r.id, row: r,
        x: lx(isFree ? FREE_PIN : p),
        y: ly(r.ii),
        price: isFree ? FREE_PIN : p,
        isFree, onFrontier: r._frontier, killed: r._killed,
        color: DATA.vendors[r.vendor].color,
        state: isFree ? 'free' : r._frontier ? 'frontier' : r._killed ? 'dead' : 'plain',
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, basis, innerW, innerH]);

  // 斩杀线阶梯路径
  const stepPath = useMemo(() => {
    const fl = [...rows]
      .filter((r) => r.ch !== 'free' && r.price(basis) != null && r.ii != null && r._frontier)
      .map((r) => ({ p: r.price(basis), ii: r.ii }))
      .sort((a, b) => a.p - b.p);
    if (!fl.length) return '';
    const startX = Math.max(lx(fl[0].p * 0.92), M.left);
    let d = `M ${startX.toFixed(1)} ${ly(fl[0].ii).toFixed(1)}`;
    for (let i = 0; i < fl.length; i++) {
      d += ` H ${lx(fl[i].p).toFixed(1)} V ${ly(fl[i].ii).toFixed(1)}`;
    }
    d += ` H ${(M.left + innerW).toFixed(1)}`;
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, basis, innerW]);

  const tooltipFor = (pt) => {
    if (!pt || !pt.row) return '';
    const r = pt.row;
    const curSym = r.cur === 'CNY' ? '¥' : '$';
    const nat = (v) => (v == null ? '—' : curSym + (+v).toFixed(v < 1 ? 3 : 2));
    const blended = nativePrice(r, 'blended');
    const chName =
      (r.provider ? t('ch.' + r.ch) + ' · ' + r.provider : t('ch.' + r.ch));
    const statusHtml = pt.isFree
      ? `<span class="tt-free">◆ ${t('tag.free')}</span>`
      : pt.onFrontier
        ? `<span class="tt-frontier">★ ${t('tag.frontier')}</span>`
        : pt.killed
          ? `<span class="tt-dead">· ${t('tag.dead')}</span>`
          : '';
    return `
      <div class="tt-title"><b>${r.model}</b></div>
      <div class="tt-row">${t('tip.channel')}: ${chName}</div>
      <div class="tt-row">${t('tip.ii')}: <b>${r.ii}</b>${r.iiNote ? ` (${r.iiNote})` : ''}</div>
      ${
        r.blendedOverride != null
          ? `<div class="tt-row">${t('tip.blendedFromOverride', { v: r.blendedOverride })}</div>`
          : `<div class="tt-row">${t('tip.pIn')} ${nat(r.pIn)} · ${t('tip.pCache')} ${nat(r.pCache)} · ${t('tip.pOut')} ${nat(r.pOut)}</div>
             <div class="tt-strong">${t('tip.blendedOf', {
               usd: '$' + (pt.price < 0.1 ? pt.price.toFixed(3) : pt.price.toFixed(2)),
               native: r.cur === 'CNY' ? ` (${curSym}${(+blended).toFixed(2)})` : '',
             })}/M</div>`
      }
      ${statusHtml}
      ${r.note ? `<div class="tt-note">${r.note}</div>` : ''}
    `;
  };

  const flipTip = !!(hover?.pt && hover.pt.x > M.left + innerW * 0.62);

  return (
    <div className="chart-wrap" ref={ref}>
      <svg width={width} height={H} className="killchart">
        {/* X 网格与刻度 */}
        {X_TICKS.map((v) => (
          <g key={'gx' + v}>
            <line x1={lx(v)} x2={lx(v)} y1={M.top} y2={M.top + innerH} className="gridline" />
            <text x={lx(v)} y={M.top + innerH + 20} className="tick" textAnchor="middle">${v}</text>
          </g>
        ))}
        {/* Y 网格与刻度 */}
        {[25, 30, 35, 40, 45, 50, 55, 60, 65].map((v) => (
          <g key={'gy' + v}>
            <line x1={M.left} x2={M.left + innerW} y1={ly(v)} y2={ly(v)} className="gridline" />
            <text x={M.left - 8} y={ly(v) + 4} className="tick" textAnchor="end">{v}</text>
          </g>
        ))}
        <text x={M.left + innerW / 2} y={H - 14} className="axis-name" textAnchor="middle">{t('chart.axisX')}</text>
        <text x={16} y={M.top + innerH / 2} className="axis-name" textAnchor="middle"
              transform={`rotate(-90 16 ${M.top + innerH / 2})`}>{t('chart.axisY')}</text>

        {/* 斩杀线 */}
        {stepPath && (
          <>
            <path d={stepPath} className="frontier-glow" />
            <path d={stepPath} className="frontier-line" />
          </>
        )}

        {/* 点位 */}
        {pts.map((pt) => (
          <g
            key={pt.id}
            className={[
              'pt',
              's-' + pt.state,
              focusOn && pt.state === 'dead' ? 'dimmed-hard' : '',
              hover?.pt?.id === pt.id ? 'hovered' : '',
            ].join(' ')}
            style={{ transform: `translate(${pt.x}px, ${pt.y}px)` }}
            onMouseEnter={() => setHover({ pt })}
            onMouseLeave={() => setHover((h) => (h?.pt?.id === pt.id ? null : h))}
          >
            {pt.isFree && (
              <rect className="glyph" x={-4.5} y={-4.5} width={9} height={9}
                    transform={`rotate(45)`} rx={1.5} />
            )}
            {!pt.isFree && (
              <circle className="dot-c"
                      r={pt.state === 'frontier' ? 7 : pt.state === 'dead' ? 4 : 5}
                      style={{ fill: pt.state === 'dead' && !focusOn ? hexA(pt.color, .55) : pt.color }} />
            )}
            {(labelsOn || pt.state === 'frontier') && pt.row && (
              <text className="pt-label" y={-11} textAnchor="middle">{pt.row.model}</text>
            )}
          </g>
        ))}

        {pts.length === 0 && (
          <text x={M.left + innerW / 2} y={M.top + innerH / 2} className="empty-hint" textAnchor="middle">
            – –
          </text>
        )}
      </svg>

      <div className="chart-legend">
        <span className="lg lg-free">◆ {t('chart.legend.free')}</span>
        <span className="lg lg-frontier">★ {t('chart.legend.frontier')}</span>
        <span className="lg lg-dead">· {t('chart.legend.dead')}</span>
      </div>

      {hover?.pt?.row && (
        <div
          className={'tooltip' + (flipTip ? ' flip' : '')}
          style={{ top: hover.pt.y - 8, left: hover.pt.x }}
          dangerouslySetInnerHTML={{ __html: tooltipFor(hover.pt) }}
        />
      )}
    </div>
  );
}
