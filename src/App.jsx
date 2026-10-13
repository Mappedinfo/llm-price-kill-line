import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from './i18n/index.jsx';
import { DATA, getRows, getSubsPoints, computeFrontier, frontierOf } from './lib/dataset.js';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import KillLineChart from './components/KillLineChart.jsx';
import KpiRow from './components/KpiRow.jsx';
import ChannelSpread from './components/ChannelSpread.jsx';
import ValueBoard from './components/ValueBoard.jsx';
import OfferingsTable from './components/OfferingsTable.jsx';
import SubsTable from './components/SubsTable.jsx';
import PlansSection from './components/PlansSection.jsx';
import Methodology from './components/Methodology.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const CH_KEYS = Object.keys(DATA.channels);
const VENDOR_KEYS = Object.keys(DATA.vendors);
const FLAG_KEYS = ['dep', 'free', 'noTrain', 'labels', 'focus'];
const DEFAULT_FLAGS = { dep: true, free: true, noTrain: false, labels: false, focus: false };

/* ---------- URL hash 状态(可分享) ---------- */
function parseHash() {
  const h = new URLSearchParams((location.hash || '').replace(/^#/, ''));
  const allCh = Object.fromEntries(CH_KEYS.map((k) => [k, true]));
  const allV = Object.fromEntries(VENDOR_KEYS.map((k) => [k, true]));
  const out = {
    basis: ['blended', 'in', 'out'].includes(h.get('basis')) ? h.get('basis') : 'blended',
    mix: ['std', 'agent'].includes(h.get('mix')) ? h.get('mix') : 'std',
    mode: ['list', 'subs'].includes(h.get('mode')) ? h.get('mode') : 'list',
    selCh: { ...allCh },
    selVendor: { ...allV },
    flags: { ...DEFAULT_FLAGS },
  };
  if (h.get('ch')) {
    const on = new Set(h.get('ch').split(',').filter((k) => CH_KEYS.includes(k)));
    for (const k of CH_KEYS) out.selCh[k] = on.size === 0 ? true : on.has(k);
  }
  if (h.get('v')) {
    const on = new Set(h.get('v').split(',').filter((k) => VENDOR_KEYS.includes(k)));
    for (const k of VENDOR_KEYS) out.selVendor[k] = on.size === 0 ? true : on.has(k);
  }
  if (h.get('f') != null) {
    const f = new Set(h.get('f').split(','));
    for (const k of FLAG_KEYS) out.flags[k] = f.has(k);
  }
  return out;
}

function Section({ n, titleKey, subKey, descKey, children }) {
  const { t } = useI18n();
  return (
    <section id={'sec-' + n}>
      <div className="sec-head">
        <span className="sec-index">{String(n).padStart(2, '0')}</span>
        <div>
          <h2>{t(titleKey)}<span className="en">{t(subKey)}</span></h2>
          <p className="desc">{t(descKey)}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function App() {
  const { t } = useI18n();
  const init = useMemo(parseHash, []);

  const [selCh, setSelCh] = useState(init.selCh);
  const [selVendor, setSelVendor] = useState(init.selVendor);
  const [basis, setBasis] = useState(init.basis);
  const [mix, setMix] = useState(init.mix);
  const [mode, setMode] = useState(init.mode);
  const [flags, setFlags] = useState(init.flags);

  const toggleCh = (k) => setSelCh((s) => ({ ...s, [k]: !s[k] }));
  const toggleVendor = (k) => setSelVendor((s) => ({ ...s, [k]: !s[k] }));
  const setAll = (setter, keys) => (v) => setter(Object.fromEntries(keys.map((k) => [k, v])));
  const toggleFlag = (m) => setFlags((f) => ({ ...f, [m]: !f[m] }));
  const resetAll = () => {
    setAll(setSelCh, CH_KEYS)(true);
    setAll(setSelVendor, VENDOR_KEYS)(true);
    setBasis('blended');
    setMix('std');
    setMode('list');
    setFlags(DEFAULT_FLAGS);
  };

  // hash 回写(可分享链接)
  useEffect(() => {
    const p = new URLSearchParams();
    const locale = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
    p.set('lang', locale);
    p.set('basis', basis);
    p.set('mix', mix);
    p.set('mode', mode);
    p.set('ch', CH_KEYS.filter((k) => selCh[k]).join(','));
    p.set('v', VENDOR_KEYS.filter((k) => selVendor[k]).join(','));
    p.set('f', FLAG_KEYS.filter((k) => flags[k]).join(','));
    const h = '#' + p.toString();
    if (location.hash !== h) history.replaceState(null, '', h);
  }, [basis, mix, mode, selCh, selVendor, flags]);

  const allRows = useMemo(() => getRows(mix), [mix]);

  const visible = useMemo(
    () =>
      allRows.filter(
        (r) =>
          selCh[r.ch] &&
          selVendor[r.vendor] &&
          (flags.dep || !r.dep) &&
          (!(r.ch === 'free' && !flags.free)) &&
          (!(flags.noTrain && r.trains))
      ),
    [allRows, selCh, selVendor, flags.dep, flags.free, flags.noTrain]
  );

  // 列表视图:按量报价
  const listData = useMemo(() => {
    const { frontier, fIds, dominated } = computeFrontier(visible, basis);
    return {
      frontier,
      fIds,
      dominated,
      annotated: visible.map((r) => ({ ...r, _frontier: fIds.has(r.id), _killed: dominated.has(r.id) })),
    };
  }, [visible, basis]);

  // 订阅视图:真实单价 = 月费 ÷ 月可用 tokens
  const subsData = useMemo(() => {
    const pts = getSubsPoints(mix).filter(
      (sp) => selVendor[sp.vendor] && (flags.dep || !sp.dep) && !(flags.noTrain && sp.trains)
    );
    const { frontier, fIds, dominated } = frontierOf(pts);
    return {
      frontier,
      fIds,
      dominated,
      annotated: pts.map((sp) => ({
        ...sp,
        ch: 'subs',
        _subs: true,
        _frontier: fIds.has(sp.id),
        _killed: dominated.has(sp.id),
        price: () => sp.real,
      })),
    };
  }, [mix, selVendor, flags.dep, flags.noTrain]);

  const isSubs = mode === 'subs';
  const { frontier, fIds, dominated, annotated } = isSubs ? subsData : listData;

  const chCounts = useMemo(() => countBy(DATA.offerings, 'ch'), []);
  const vendorCounts = useMemo(
    () => countBy(DATA.offerings.concat(DATA.subs.map((s) => ({ vendor: s.vendor }))), 'vendor'),
    []
  );

  const kpis = useMemo(() => {
    const fl = frontier;
    const ceiling = fl.length ? fl[fl.length - 1] : null;
    return {
      activeCount: annotated.filter((r) => r.ch !== 'free').length,
      frontierCount: fl.length,
      deadCount: dominated.size,
      ceilingPrice: ceiling ? '$' + (ceiling.p < 0.1 ? ceiling.p.toFixed(4) : ceiling.p.toFixed(2)) : null,
      ceiling: ceiling ? (isSubs ? `${ceiling.r.model} @ ${ceiling.r.plan}` : ceiling.r.model) : null,
    };
  }, [annotated, frontier, dominated, isSubs]);

  const readoutList = frontier
    .map(({ r, p }) => `${r.model}($${p < 0.1 ? p.toFixed(4) : p.toFixed(2)})`)
    .join(' → ');

  return (
    <div className="page">
      <Header />
      <FilterBar
        channels={Object.entries(DATA.channels)}
        vendors={Object.entries(DATA.vendors)}
        selCh={selCh} selVendor={selVendor}
        basis={basis} mix={mix} mode={mode} flags={flags}
        toggleCh={toggleCh} toggleVendor={toggleVendor}
        setChAll={setAll(setSelCh, CH_KEYS)}
        setVendorAll={setAll(setSelVendor, VENDOR_KEYS)}
        setBasis={setBasis} setMix={setMix} setMode={setMode}
        toggleFlag={toggleFlag} resetAll={resetAll}
        chCounts={chCounts} vendorCounts={vendorCounts}
      />

      <Section n={1} titleKey={isSubs ? 'sec.subsview.title' : 'sec.chart.title'} subKey="sec.chart.sub" descKey={isSubs ? 'sec.subsview.desc' : 'sec.chart.desc'}>
        <div className="card">
          <ErrorBoundary fallback={t('chart.error')}>
            <KillLineChart rows={annotated} basis={isSubs ? 'blended' : basis} labelsOn={flags.labels} focusOn={flags.focus} onReset={resetAll} />
          </ErrorBoundary>
        </div>
        <KpiRow kpis={kpis} />
        <p className="readout" dangerouslySetInnerHTML={{ __html: t('chart.readout', { n: frontier.length, list: readoutList }) }} />
      </Section>

      {isSubs && (
        <Section n={2} titleKey="sec.substable.title" subKey="sec.substable.sub" descKey="sec.substable.desc">
          <SubsTable rows={subsData.annotated} fIds={fIds} dominated={dominated} />
        </Section>
      )}

      {!isSubs && (
        <>
          <Section n={2} titleKey="sec.spread.title" subKey="sec.spread.sub" descKey="sec.spread.desc">
            <ChannelSpread />
          </Section>

          <Section n={3} titleKey="sec.value.title" subKey="sec.value.sub" descKey="sec.value.desc">
            <ValueBoard />
          </Section>
        </>
      )}

      {!isSubs && (
        <Section n={4} titleKey="sec.table.title" subKey="sec.table.sub" descKey="sec.table.desc">
          <OfferingsTable rowsForTable={annotated} fIds={fIds} dominated={dominated} />
        </Section>
      )}

      <Section n={isSubs ? 3 : 5} titleKey="sec.plans.title" subKey="sec.plans.sub" descKey="sec.plans.desc">
        <PlansSection />
      </Section>

      <Section n={isSubs ? 4 : 6} titleKey="sec.method.title" subKey="sec.method.sub" descKey="">
        <Methodology />
      </Section>

      <Footer />
    </div>
  );
}

function countBy(list, key) {
  const m = {};
  for (const x of list) m[x[key]] = (m[x[key]] || 0) + 1;
  return m;
}
