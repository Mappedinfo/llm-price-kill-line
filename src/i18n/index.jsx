import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { dict } from './locales.js';

const I18nCtx = createContext(null);
const STORE_KEY = 'lkl.locale';

function detect() {
  try {
    const h = new URLSearchParams(location.hash.replace(/^#/, '')).get('lang');
    if (h && dict[h]) return h;
    const saved = localStorage.getItem(STORE_KEY);
    if (saved && dict[saved]) return saved;
  } catch { /* ignore */ }
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(detect);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en-US';
    try { localStorage.setItem(STORE_KEY, locale); } catch { /* ignore */ }
    // 同步 lang 到 URL hash(可分享)
    try {
      const p = new URLSearchParams(location.hash.replace(/^#/, ''));
      if (p.get('lang') !== locale) {
        p.set('lang', locale);
        history.replaceState(null, '', '#' + p.toString());
      }
    } catch { /* ignore */ }
  }, [locale]);

  const value = useMemo(() => {
    const t = (key, vars) => {
      let s = dict[locale][key] ?? dict.zh[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
      return s;
    };
    return { locale, setLocale, t };
  }, [locale]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error('useI18n outside provider');
  return ctx;
}

/** 语言切换胶囊 */
export function LangSwitch() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="seg" role="group" aria-label="language">
      <button className={locale === 'zh' ? 'on' : ''} onClick={() => setLocale('zh')}>中</button>
      <button className={locale === 'en' ? 'on' : ''} onClick={() => setLocale('en')}>EN</button>
    </div>
  );
}
