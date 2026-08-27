export function fmtMoney(v, digits = 2) {
  if (v == null || Number.isNaN(v)) return '—';
  const d = v < 1 ? Math.max(digits, 3) : digits;
  return '$' + (+v.toFixed(d)).toString();
}

export function fmtNative(v, cur) {
  if (v == null) return '—';
  const sym = cur === 'CNY' ? '¥' : '$';
  return sym + (+v.toFixed(v < 1 ? 3 : 2)).toString();
}

export function hexA(hex, a) {
  const h = (hex || '#888888').replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function countBy(list, key) {
  const m = {};
  for (const x of list) m[x[key]] = (m[x[key]] || 0) + 1;
  return m;
}
