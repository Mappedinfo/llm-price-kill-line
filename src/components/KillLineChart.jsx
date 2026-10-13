import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';
import { DATA, nativePrice } from '../lib/dataset.js';
import { fmtMoney, hexA } from '../lib/format.js';
import useSize from './useSize.js';

/* 视图域边界 */
const FULL = { x0: 0.03, x1: 20, y0: 25, y1: 66 };
const BOUNDS = { x0: 0.02, x1: 40, y0: 18, y1: 72 };
const FREE_PIN = 0.032;
const H = 640;
const M = { top: 22, right: 30, bottom: 56, left: 60 };
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

function fmtX(v) {
  if (v >= 10) return '$' + Math.round(v);
  if (v >= 1) return '$' + +v.toFixed(1);
  if (v >= 0.1) return '$' + +v.toFixed(2);
  return '$' + +v.toFixed(3);
}
function logTicks(x0, x1) {
  const t = [];
  const d0 = Math.floor(Math.log10(x0)), d1 = Math.ceil(Math.log10(x1));
  for (let d = d0; d <= d1; d++) for (const m of [1, 2, 3, 5]) {
    const v = m * 10 ** d;
    if (v >= x0 * 1.02 && v <= x1 * 0.98) t.push(v);
  }
  if (t.length < 3) {
    for (let i = 0; i <= 5; i++) t.push(10 ** (Math.log10(x0) + ((Math.log10(x1) - Math.log10(x0)) * i) / 5));
  }
  return t.slice(0, 10);
}
function yTicks(y0, y1) {
  const span = y1 - y0;
  const step = [0.5, 1, 2, 5, 10, 20].find((s) => span / s <= 7) || 25;
  const t = [];
  for (let v = Math.ceil(y0 / step) * step; v <= y1 + 1e-9; v += step) t.push(+v.toFixed(2));
  return t;
}

export default function KillLineChart({ rows, basis, labelsOn, focusOn, onReset }) {
  const { t } = useI18n();
  const [ref, width] = useSize();
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null); // 恒为 null 或 {pt}

  /* 视图域(平移/缩放) */
  const [view, setView] = useState(FULL);
  const [box, setBox] = useState(null); // 框选矩形 px
  const [interacting, setInteracting] = useState(false);
  const idleTimer = useRef(null);
  const drag = useRef(null);

  const innerW = Math.max(width - M.left - M.right, 300);
  const innerH = H - M.top - M.bottom;
  const lx = (v) =>
    M.left + ((Math.log10(clamp(v, view.x0, view.x1)) - Math.log10(view.x0)) / (Math.log10(view.x1) - Math.log10(view.x0))) * innerW;
  const ly = (ii) => M.top + ((view.y1 - clamp(ii, view.y0, view.y1)) / (view.y1 - view.y0)) * innerH;
  const dataX = (px) => 10 ** (Math.log10(view.x0) + ((px - M.left) / innerW) * (Math.log10(view.x1) - Math.log10(view.x0)));
  const dataY = (py) => view.y1 - ((py - M.top) / innerH) * (view.y1 - view.y0);

  const touch = () => {
    setInteracting(true);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setInteracting(false), 220);
  };
  const clampView = (v) => ({
    x0: clamp(v.x0, BOUNDS.x0, v.x1 - 0.001),
    x1: clamp(v.x1, v.x0 + 0.001, BOUNDS.x1),
    y0: clamp(v.y0, BOUNDS.y0, v.y1 - 0.5),
    y1: clamp(v.y1, v.y0 + 0.5, BOUNDS.y1),
  });
  const zoomAt = (px, py, factor) => {
    touch();
    setView((v) => {
      const cx = Math.log10(dataX(px)), cy = dataY(py);
      const nlgSpan = clamp((Math.log10(v.x1) - Math.log10(v.x0)) * factor, 0.12, Math.log10(BOUNDS.x1) - Math.log10(BOUNDS.x0));
      const cxl = clamp(cx, Math.log10(BOUNDS.x0) + nlgSpan / 2, Math.log10(BOUNDS.x1) - nlgSpan / 2);
      const nySpan = clamp((v.y1 - v.y0) * factor, 2, BOUNDS.y1 - BOUNDS.y0);
      const ncy = clamp(cy, BOUNDS.y0 + nySpan / 2, BOUNDS.y1 - nySpan / 2);
      return clampView({
        x0: 10 ** (cxl - nlgSpan / 2), x1: 10 ** (cxl + nlgSpan / 2),
        y0: ncy - nySpan / 2, y1: ncy + nySpan / 2,
      });
    });
  };
  const panBy = (dPx, dPy) => {
    touch();
    setView((v) => clampView({
      x0: 10 ** (Math.log10(v.x0) + (dPx / innerW) * (Math.log10(v.x1) - Math.log10(v.x0))),
      x1: 10 ** (Math.log10(v.x1) + (dPx / innerW) * (Math.log10(v.x1) - Math.log10(v.x0))),
      y0: v.y0 + (dPy / innerH) * (v.y1 - v.y0),
      y1: v.y1 + (dPy / innerH) * (v.y1 - v.y0),
    }));
  };
  const resetView = () => { touch(); setView(FULL); setBox(null); };

  /* 滚轮缩放(非 passive) */
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const dy = Math.max(-150, Math.min(150, e.deltaY));
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(dy * 0.0012));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, innerW, innerH]);

  const onPointerDown = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    drag.current = e.shiftKey
      ? { mode: 'box', ax: px, ay: py }
      : { mode: 'pan', px, py }; // px/py = 上一次事件位置,平移按增量计算
    svgRef.current.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    if (d.mode === 'pan') {
      panBy(d.px - px, py - d.py);
      d.px = px; d.py = py; // 关键:只平移本次增量,避免全程位移反复叠加越拖越快
    } else {
      setBox({ x0: Math.min(d.ax, px), y0: Math.min(d.ay, py), x1: Math.max(d.ax, px), y1: Math.max(d.ay, py) });
    }
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d?.mode === 'box' && box) {
      const w = Math.abs(box.x1 - box.x0), h = Math.abs(box.y1 - box.y0);
      if (w > 12 && h > 12) {
        const nx0 = dataX(Math.min(box.x0, box.x1)), nx1 = dataX(Math.max(box.x0, box.x1));
        const ny0 = dataY(Math.max(box.y0, box.y1)), ny1 = dataY(Math.min(box.y0, box.y1));
        touch();
        setView(clampView({ x0: nx0, x1: nx1, y0: ny0, y1: ny1 }));
      }
    }
    setBox(null);
  };
  const onKeyDown = (e) => {
    const k = e.key;
    if (k === '0') { resetView(); return; }
    if (k === '+' || k === '=') { zoomAt(M.left + innerW / 2, M.top + innerH / 2, 1 / 1.25); return; }
    if (k === '-') { zoomAt(M.left + innerW / 2, M.top + innerH / 2, 1.25); return; }
    const step = 0.18;
    if (k === 'ArrowLeft') { panBy(-innerW * step, 0); e.preventDefault(); }
    if (k === 'ArrowRight') { panBy(innerW * step, 0); e.preventDefault(); }
    if (k === 'ArrowUp') { panBy(0, -innerH * step); e.preventDefault(); }
    if (k === 'ArrowDown') { panBy(0, innerH * step); e.preventDefault(); }
  };

  /* 组装点位 */
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
  }, [rows, basis, innerW, innerH, view]);

  /* 差分动画:留场点原地更新、入场点弹入、离场点淡出后再移除(渲染集合) */
  const [shown, setShown] = useState([]); // [{pt, entering, leaving}]
  const prevById = useRef(new Map());
  useEffect(() => {
    setShown(() => {
      const next = [];
      const seen = new Set();
      for (const pt of pts) {
        seen.add(pt.id);
        next.push({ pt, entering: !prevById.current.has(pt.id), leaving: false });
      }
      for (const [, oldPt] of prevById.current) {
        if (!seen.has(oldPt.id)) next.push({ pt: oldPt, entering: false, leaving: true });
      }
      prevById.current = new Map(pts.map((p) => [p.id, p]));
      return next;
    });
    const t = setTimeout(() => setShown((prev) => prev.filter((e) => !e.leaving)), 520);
    return () => clearTimeout(t);
  }, [pts]);

  /* 斩杀线阶梯路径 */
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
  }, [rows, basis, innerW, view]);

  const tooltipFor = (pt) => {
    if (!pt || !pt.row) return '';
    const r = pt.row;
    if (r._subs) {
      const allow =
        r.allowance.usd != null
          ? t('subs.allow.usd', { usd: r.allowance.usd, tokens: fmtTokens(r.tokensM) })
          : r.allowance.yi != null
            ? t('subs.allow.yi', { yi: (+r.allowance.yi).toFixed(1), tokens: fmtTokens(r.tokensM) })
            : t('subs.allow.credits', { tokens: fmtTokens(r.tokensM) });
      return `
        <div class="tt-title"><b>${r.model}</b></div>
        <div class="tt-row">${t('tip.plan')}: ${r.plan}</div>
        <div class="tt-row">${t('tip.fee')}: $${r.feeUsd}/mo</div>
        <div class="tt-row">${t('tip.allow')}: ${allow}</div>
        <div class="tt-strong">${t('tip.real')}: $${r.real < 0.01 ? r.real.toFixed(5) : r.real.toFixed(4)}/M · ${t('tip.ii')} <b>${r.ii}</b></div>
        <div class="tt-row"><span class="tag ${r.conf === 'official' ? 'official' : r.conf === 'community' ? 'media' : ''}">${t('subs.conf.' + r.conf)}</span></div>
        ${pt.onFrontier ? `<span class="tt-frontier">★ ${t('tag.frontier')}</span>` : pt.killed ? `<span class="tt-dead">· ${t('tag.dead')}</span>` : ''}
        ${r.note ? `<div class="tt-note">${r.note}</div>` : ''}
      `;
    }
    const curSym = r.cur === 'CNY' ? '¥' : '$';
    const nat = (v) => (v == null ? '—' : curSym + (+v).toFixed(v < 1 ? 3 : 2));
    const blended = nativePrice(r, 'blended');
    const chName = r.provider ? t('ch.' + r.ch) + ' · ' + r.provider : t('ch.' + r.ch);
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
  const zoomed = view.x0 !== FULL.x0 || view.x1 !== FULL.x1 || view.y0 !== FULL.y0 || view.y1 !== FULL.y1;

  return (
    <div className="chart-wrap" ref={ref}>
      <svg
        ref={svgRef}
        width={width}
        height={H}
        className={'killchart' + (interacting ? ' interacting' : '')}
        tabIndex={0}
        role="application"
        aria-label={t('chart.zoomHint')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => { drag.current = null; setBox(null); }}
        onDoubleClick={resetView}
        onKeyDown={onKeyDown}
        style={{ touchAction: 'none' }}
      >
        {logTicks(view.x0, view.x1).map((v) => (
          <g key={'gx' + v}>
            <line x1={lx(v)} x2={lx(v)} y1={M.top} y2={M.top + innerH} className="gridline" />
            <text x={lx(v)} y={M.top + innerH + 20} className="tick" textAnchor="middle">{fmtX(v)}</text>
          </g>
        ))}
        {yTicks(view.y0, view.y1).map((v) => (
          <g key={'gy' + v}>
            <line x1={M.left} x2={M.left + innerW} y1={ly(v)} y2={ly(v)} className="gridline" />
            <text x={M.left - 8} y={ly(v) + 4} className="tick" textAnchor="end">{v}</text>
          </g>
        ))}
        <text x={M.left + innerW / 2} y={H - 14} className="axis-name" textAnchor="middle">{t('chart.axisX')}</text>
        <text x={16} y={M.top + innerH / 2} className="axis-name" textAnchor="middle"
              transform={`rotate(-90 16 ${M.top + innerH / 2})`}>{t('chart.axisY')}</text>

        {stepPath && (
          <>
            <path d={stepPath} className="frontier-glow" />
            <path d={stepPath} className="frontier-line" />
          </>
        )}

        {shown.map(({ pt, entering, leaving }) => (
          <g
            key={pt.id}
            className={[
              'pt',
              's-' + pt.state,
              entering ? 'entering' : '',
              leaving ? 'leaving' : '',
              focusOn && pt.state === 'dead' && !leaving ? 'dimmed-hard' : '',
              hover?.pt?.id === pt.id ? 'hovered' : '',
            ].join(' ')}
            style={{ transform: `translate(${pt.x}px, ${pt.y}px)` }}
            onMouseEnter={() => setHover({ pt })}
            onMouseLeave={() => setHover((h) => (h?.pt?.id === pt.id ? null : h))}
          >
            {pt.isFree && (
              <rect className="glyph" x={-4.5} y={-4.5} width={9} height={9} transform="rotate(45)" rx={1.5} />
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

        {box && (
          <rect className="zoom-box"
                x={Math.min(box.x0, box.x1)} y={Math.min(box.y0, box.y1)}
                width={Math.abs(box.x1 - box.x0)} height={Math.abs(box.y1 - box.y0)} />
        )}
      </svg>

      <div className="chart-toolbar">
        {zoomed && (
          <button type="button" className="pill slim" onClick={resetView}>↺ {t('chart.resetView')}</button>
        )}
        <span className="zoom-hint">{t('chart.zoomHint')}</span>
        <span className="spacer" />
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

function fmtTokens(m) {
  if (m >= 1000) return (m / 1000).toFixed(1) + 'B';
  if (m >= 10) return Math.round(m) + 'M';
  return (+m.toFixed(1)) + 'M';
}
