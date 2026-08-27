import React from 'react';
import { useI18n } from '../i18n/index.jsx';
import { DATA, MECH_EN, PLAN_EN } from '../lib/dataset.js';

/** 订阅/Token包 + 计费机制速查 */
export default function PlansSection() {
  const { t, locale } = useI18n();

  return (
    <>
      <div className="card table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('plans.col.product')}</th>
              <th>{t('plans.col.fee')}</th>
              <th style={{ width: '52%' }}>{t('plans.col.quota')}</th>
              <th>{t('plans.col.caliber')}</th>
            </tr>
          </thead>
          <tbody>
            {DATA.plans.map((p, i) => {
              const quota = locale === 'en' && PLAN_EN[i]?.quota ? PLAN_EN[i].quota : p.quota;
              const fee = locale === 'en' && PLAN_EN[i]?.fee ? PLAN_EN[i].fee : p.fee;
              const note = locale === 'en' && PLAN_EN[i]?.note ? PLAN_EN[i].note : p.note;
              return (
                <tr key={i}>
                  <td><b>{p.vendor}</b><br /><span className="mini">{p.plan}</span></td>
                  <td className="num fee">{fee}</td>
                  <td>
                    <span className="mini">{quota}</span>
                    {note && <br />}
                    {note && <span className="mini dim">{note}</span>}{' '}
                    <a className="mini link" href={p.src} target="_blank" rel="noreferrer">↗</a>
                  </td>
                  <td>
                    {p.verified === 'official'
                      ? <span className="tag official">{locale === 'zh' ? '官方' : 'Official'}</span>
                      : <span className="tag media">{locale === 'zh' ? '媒体口径' : 'Media'}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card mech-card">
        <h3>{t('mech.title')}</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '220px' }}>{t('mech.col.channel')}</th>
              <th>{t('mech.col.how')}</th>
            </tr>
          </thead>
          <tbody>
            {DATA.mechanics.map((m, i) => {
              const how = locale === 'en' && MECH_EN[i] ? MECH_EN[i] : m.how;
              return (
                <tr key={i}>
                  <td><b>{m.channel}</b></td>
                  <td><span className="mini">{how}</span> <a className="mini link" href={m.src} target="_blank" rel="noreferrer">↗</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
