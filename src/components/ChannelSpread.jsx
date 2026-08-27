import React from 'react';
import { useI18n } from '../i18n/index.jsx';
import { DATA, spreadGroups } from '../lib/dataset.js';
import { fmtMoney } from '../lib/format.js';

export default function ChannelSpread() {
  const { t } = useI18n();
  const groups = spreadGroups();
  if (!groups.length) return null;
  const gmin = Math.min(...groups.map((g) => g.min));
  const gmax = Math.max(...groups.map((g) => g.max));

  return (
    <div className="card">
      <table className="data-table spread-table">
        <thead>
          <tr>
            <th>{t('spread.col.model')}</th>
            <th style={{ width: '58%' }}>{t('spread.col.dist')}</th>
            <th>{t('spread.col.ratio')}</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => {
            const spanLog = Math.log(gmax / gmin) || 1;
            const w = Math.max((Math.log(g.max / gmin) / spanLog) * 100, 6);
            const official = g.items.find(
              (x) => x.r.ch === 'official' || x.r.ch === 'officialCN'
            );
            const offPos =
              official &&
              ((Math.log(official.p / gmin) / Math.log(g.max / gmin)) * w).toFixed(1);
            return (
              <tr key={g.model}>
                <td>
                  <span className="dot" style={{ background: DATA.vendors[g.vendor].color }} />
                  {g.model}
                </td>
                <td>
                  <div className="track" style={{ width: `calc(${w}% + 140px)` }}>
                    <div
                      className="fill"
                      style={{
                        background: `linear-gradient(90deg, ${hexSafe(DATA.vendors[g.vendor].color)}44, ${hexSafe(DATA.vendors[g.vendor].color)}11)`,
                      }}
                    />
                    {offPos != null && <i className="mark" style={{ left: offPos + '%' }} />}
                  </div>
                  <div className="chip-list">
                    {g.items.map(({ r, p }) => (
                      <span className="mini-chip" key={r.id}>
                        {t('ch.' + r.ch)}
                        {r.provider ? `·${r.provider}` : ''} <b>{fmtMoney(p)}</b>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="num strong">×{(g.max / g.min).toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function hexSafe(c) {
  return c && c.startsWith('#') ? c : '#888888';
}
