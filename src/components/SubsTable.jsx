import React from 'react';
import { useI18n } from '../i18n/index.jsx';
import { fmtMoney } from '../lib/format.js';

/** 订阅真实价表格(订阅视图下的第②区) */
export default function SubsTable({ rows, fIds, dominated }) {
  const { t } = useI18n();
  const sorted = [...rows].sort((a, b) => (a.real ?? Infinity) - (b.real ?? Infinity));

  const allowText = (sp) => {
    if (sp.allowance.usd != null)
      return t('subs.allow.usd', { usd: sp.allowance.usd, tokens: fmtTokens(sp.tokensM) });
    if (sp.allowance.yi != null)
      return t('subs.allow.yi', { yi: (+sp.allowance.yi).toFixed(1), tokens: fmtTokens(sp.tokensM) });
    return t('subs.allow.credits', { tokens: fmtTokens(sp.tokensM) });
  };
  const confTag = (c) => {
    const cls = { official: 'official', community: 'media', derived: 'dead' }[c] || '';
    return <span className={'tag ' + cls}>{t('subs.conf.' + c)}</span>;
  };

  return (
    <div className="card table-scroll">
      <table className="data-table sticky-head">
        <thead>
          <tr>
            <th>{t('subs.th.plan')}</th>
            <th>{t('subs.th.model')}</th>
            <th>{t('subs.th.allow')}</th>
            <th className="num">{t('subs.th.real')}</th>
            <th className="num">{t('subs.th.ii')}</th>
            <th>{t('th.status')}</th>
            <th>{t('plans.col.caliber')}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((sp) => (
            <tr key={sp.id}>
              <td className="fee">{sp.plan}</td>
              <td>{sp.model}</td>
              <td><span className="mini">{allowText(sp)}</span></td>
              <td className="num strong">{fmtMoney(sp.real, 4)}</td>
              <td className="num">{sp.ii}</td>
              <td>
                {dominated.has(sp.id)
                  ? <span className="tag dead">{t('tag.dead')}</span>
                  : fIds.has(sp.id)
                    ? <span className="tag frontier">{t('tag.frontier')}</span>
                    : null}
              </td>
              <td>
                {confTag(sp.conf)}{' '}
                <a className="mini link" href={sp.src} target="_blank" rel="noreferrer">↗</a>
                {sp.note && <><br /><span className="mini dim">{sp.note}</span></>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function fmtTokens(m) {
  if (m >= 1000) return (m / 1000).toFixed(1) + 'B';
  if (m >= 10) return Math.round(m) + 'M';
  return (+m.toFixed(1)) + 'M';
}
