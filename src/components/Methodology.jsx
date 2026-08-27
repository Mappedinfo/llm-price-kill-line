import React from 'react';
import { useI18n } from '../i18n/index.jsx';
import { DATA } from '../lib/dataset.js';

const CALC_KEYS = ['caveat.1', 'caveat.2', 'caveat.3', 'caveat.4', 'caveat.5'];
const SNAP_KEYS = ['snap.1', 'snap.2', 'snap.3', 'snap.4', 'snap.5', 'snap.6'];

export default function Methodology() {
  const { t } = useI18n();
  return (
    <div className="method-grid">
      <div className="card">
        <h3>{t('method.calc.title')}</h3>
        <ol className="rule-list">
          {CALC_KEYS.map((k) => (
            <li key={k} dangerouslySetInnerHTML={{ __html: t(k) }} />
          ))}
        </ol>
      </div>
      <div>
        <div className="card">
          <h3>{t('method.snap.title')}</h3>
          <ul className="rule-list loose">
            {SNAP_KEYS.map((k) => (
              <li key={k} dangerouslySetInnerHTML={{ __html: t(k) }} />
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>{t('method.src.title')}</h3>
          <div className="srcs">
            {DATA.sources.map((s) => (
              <a key={s.url} className="src-chip" href={s.url} target="_blank" rel="noreferrer">{s.name}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
