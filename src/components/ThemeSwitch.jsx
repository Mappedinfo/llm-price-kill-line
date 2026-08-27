import React, { useEffect, useState } from 'react';

const KEY = 'lkl.theme';

function initial() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* ignore */ }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/** 明暗主题开关:data-theme 写在 <html> 上,CSS 变量整体换肤 */
export default function ThemeSwitch() {
  const [theme, setTheme] = useState(initial);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className="icon-toggle"
      aria-label={dark ? 'switch to light theme' : 'switch to dark theme'}
      title={dark ? '白天模式' : '夜间模式'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
