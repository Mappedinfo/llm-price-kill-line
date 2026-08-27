import React from 'react';
import { useI18n } from '../i18n/index.jsx';
import { DATA } from '../lib/dataset.js';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <span>{t('footer.text')} · {DATA.meta.asOf}</span>
      <a href="https://github.com/Mappedinfo/llm-price-kill-line" target="_blank" rel="noreferrer">{t('footer.repo')} ↗</a>
    </footer>
  );
}
