import React, { useMemo, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';
import { DATA } from '../lib/dataset.js';
import { fmtNative, fmtMoney } from '../lib/format.js';

const COLS = [
  ['vendor', 'th.vendor'], ['model', 'th.model'], ['ch', 'th.ch'], ['buy', 'th.buy'],
  ['pin', 'th.pin'], ['pcache', 'th.pcache'], ['pout', 'th.pout'],
  ['blended', 'th.blended'], ['ii', 'th.ii'], ['per', 'th.per'], ['status', 'th.status'], ['note', 'th.note'],
];

export default function OfferingsTable({ rowsForTable, fIds, dominated }) {
  const { t } = useI18n();
  const [sortI, setSortI] = useState(7);
  const [asc, setAsc] = useState(true);

  const disp = useMemo(
    () =>
      rowsForTable.map((r) => {
        const statusHtml =
          r.ii == null ? (
            ''
          ) : dominated.has(r.id) ? (
            <span className="tag dead">{t('tag.dead')}</span>
          ) : fIds.has(r.id) ? (
            <span className="tag frontier">{t('tag.frontier')}</span>
          ) : null;
        const per = r.blendedUsd && r.ii ? (r.blendedUsd / r.ii).toFixed(3) : null;
        return {
          id: r.id,
          cells: [
            `<span class="dot" style="background:${DATA.vendors[r.vendor].color}"></span>${t('vendor.' + r.vendor)}`,
            `${r.model}${
              r.dep ? ` <span class="tag">${t('tag.dep')}</span>` : ''
            }${r.open ? ` <span class="tag">${t('tag.open')}</span>` : ''}`,
            t('ch.' + r.ch) + (r.provider ? ` · ${r.provider}` : ''),
            t('buyType.' + r.ch),
            `<span class="num">${fmtNative(r.pIn, r.cur)}</span>`,
            `<span class="num">${fmtNative(r.pCache ?? r.pIn, r.cur)}</span>`,
            `<span class="num">${fmtNative(r.pOut, r.cur)}</span>`,
            `<span class="num strong">${fmtMoney(r.blendedUsd, 3)}</span>`,
            `<span class="num">${r.ii ?? '—'}${r.iiNote ? '*' : ''}</span>`,
            `<span class="num">${per != null ? '$' + per : '—'}</span>`,
            statusHtml || '',
            `<span class="mini">${r.note || ''}</span> <a class="mini link" href="${r.src}" target="_blank" rel="noreferrer">${t('table.src')}</a>${
              r.verified !== 'official' ? ` <span class="tag media">${t('tag.mediaSrc')}</span>` : ''
            }`,
          ],
        };
      }),
    [rowsForTable, fIds, dominated, t]
  );

  const sorted = useMemo(() => {
    const val = (d) => {
      const txt = d.cells[sortI].replace(/<[^>]+>/g, '').trim().replace(/[$¥×]/g, '');
      if ([4, 5, 6, 7, 8, 9].includes(sortI)) {
        const m = txt.match(/[\d.]+/);
        return m ? parseFloat(m[0]) : Infinity;
      }
      return txt;
    };
    return [...disp].sort((a, b) => {
      const x = val(a), y = val(b);
      return (x < y ? -1 : x > y ? 1 : 0) * (asc ? 1 : -1);
    });
  }, [disp, sortI, asc]);

  return (
    <div className="card table-scroll">
      <table className="data-table sticky-head">
        <thead>
          <tr>
            {COLS.map(([key, label], i) => (
              <th key={key} onClick={() => (i === sortI ? setAsc(!asc) : (setSortI(i), setAsc(true)))} className={i === sortI ? 'sorted' : ''}>
                {t(label)}
                {i === sortI && <small>{asc ? ' ↑' : ' ↓'}</small>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((d) => (
            <tr key={d.id}>
              {d.cells.map((c, i) => (
                <td key={i} dangerouslySetInnerHTML={{ __html: c }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
