import React from 'react';
import { useI18n } from '../i18n/index.jsx';
import { DATA, valueBoard } from '../lib/dataset.js';
import { fmtMoney } from '../lib/format.js';

export default function ValueBoard() {
  const { t } = useI18n();
  const list = valueBoard();
  if (!list.length) return null;
  const max = list[0].v;

  return (
    <div className="card">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t('value.col.rank')}</th>
            <th>{t('value.col.model')}</th>
            <th>{t('value.col.ch')}</th>
            <th className="num">{t('value.col.price')}</th>
            <th className="num">{t('value.col.ii')}</th>
            <th style={{ width: '32%' }}>{t('value.col.score')}</th>
          </tr>
        </thead>
        <tbody>
          {list.map((x, i) => (
            <tr key={x.r.id}>
              <td className="num dim">{i + 1}</td>
              <td>
                <span className="dot" style={{ background: DATA.vendors[x.r.vendor].color }} />
                {x.r.model}
              </td>
              <td className="dim">{t('ch.' + x.r.ch)}{x.r.provider ? `·${x.r.provider}` : ''}</td>
              <td className="num">{fmtMoney(x.r.blendedUsd, 3)}</td>
              <td className="num">{x.r.ii}</td>
              <td>
                <div className="track">
                  <div className="fill" style={{ width: (x.v / max * 100).toFixed(1) + '%', background: DATA.vendors[x.r.vendor].color }} />
                </div>
                <span className="unit">{t('value.unit', { n: Math.round(x.v) })}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
