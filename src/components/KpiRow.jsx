import React from 'react';
import { useI18n } from '../i18n/index.jsx';

export default function KpiRow({ kpis }) {
  const { t } = useI18n();
  const cells = [
    [kpis.activeCount, t('kpi.rows'), 'k-blue'],
    [kpis.frontierCount, t('kpi.frontier'), 'k-gold'],
    [kpis.deadCount, t('kpi.dead'), 'k-red'],
    [kpis.ceilingPrice || '—', kpis.ceiling ? `${t('kpi.ceiling')} · ${kpis.ceiling}` : t('kpi.ceiling'), 'k-green'],
  ];
  return (
    <div className="kpis">
      {cells.map(([v, l, cls]) => (
        <div key={l} className={'kpi card ' + cls}>
          <div className="v">{v}</div>
          <div className="l">{l}</div>
        </div>
      ))}
    </div>
  );
}
