import React from 'react';
import { useI18n } from '../i18n/index.jsx';
import { DATA, FX } from '../lib/dataset.js';

export default function Header() {
  const { t } = useI18n();
  return (
    <header className="hero">
      <div className="hero-top">
        <h1>
          <span className="dimmed">{t('site.title1')} · </span>
          <span className="accent">{t('site.title2')}</span>
        </h1>
      </div>
      <p className="subtitle">{t('site.subtitle')}</p>
      <div className="chips">
        <span className="chip"><b>{t('chip.asOf')}</b>{DATA.meta.asOf}</span>
        <span className="chip"><b>{t('chip.fx')}</b>1 USD ≈ {FX} CNY</span>
        <span className="chip"><b>{t('chip.ii')}</b>{DATA.meta.iiVersion}</span>
        <span className="chip">{t('chip.blended')}</span>
        <span className="chip"><b>{t('chip.channels', { n: Object.keys(DATA.channels).length })}</b></span>
      </div>
    </header>
  );
}
