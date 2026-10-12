import React, { useMemo, useState } from 'react';
import { useI18n } from './i18n/index.jsx';
import { DATA, getRows, computeFrontier } from './lib/dataset.js';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import KillLineChart from './components/KillLineChart.jsx';
import KpiRow from './components/KpiRow.jsx';
import ChannelSpread from './components/ChannelSpread.jsx';
import ValueBoard from './components/ValueBoard.jsx';
import OfferingsTable from './components/OfferingsTable.jsx';
import PlansSection from './components/PlansSection.jsx';
import Methodology from './components/Methodology.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const CH_KEYS = Object.keys(DATA.channels);
const VENDOR_KEYS = Object.keys(DATA.vendors);
const DEFAULT_FLAGS = { dep: true, free: true, noTrain: false, labels: false, focus: false };

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
  const allRows = getRows();

  const [selCh, setSelCh] = useState(Object.fromEntries(CH_KEYS.map((k) => [k, true])));
  const [selVendor, setSelVendor] = useState(Object.fromEntries(VENDOR_KEYS.map((k) => [k, true])));
  const [basis, setBasis] = useState('blended');
  const [flags, setFlags] = useState(DEFAULT_FLAGS);

  const toggleCh = (k) => setSelCh((s) => ({ ...s, [k]: !s[k] }));
  const toggleVendor = (k) => setSelVendor((s) => ({ ...s, [k]: !s[k] }));
  const setAll = (setter, keys) => (v) => setter(Object.fromEntries(keys.map((k) => [k, v])));
  const toggleFlag = (m) => setFlags((f) => ({ ...f, [m]: !f[m] }));
  const resetAll = () => {
    setAll(setSelCh, CH_KEYS)(true);
    setAll(setSelVendor, VENDOR_KEYS)(true);
    setBasis('blended');
    setFlags(DEFAULT_FLAGS);
  };

  // 可见行(含免费/停售/训练数据筛选)
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

  // 斩杀线(仅可见集合内计算)
  const { frontier, fIds, dominated } = useMemo(
    () => computeFrontier(visible, basis),
    [visible, basis]
  );
  const annotated = useMemo(
    () =>
      visible.map((r) => ({
        ...r,
        _frontier: fIds.has(r.id),
        _killed: dominated.has(r.id),
      })),
    [visible, fIds, dominated]
  );

  const chCounts = useMemo(() => countBy(allRows, 'ch'), [allRows]);
  const vendorCounts = useMemo(() => countBy(allRows, 'vendor'), [allRows]);

  const kpis = useMemo(() => {
    const fl = frontier;
    const ceiling = fl.length ? fl[fl.length - 1] : null;
    return {
      activeCount: annotated.filter((r) => r.ch !== 'free').length,
      frontierCount: fl.length,
      deadCount: dominated.size,
      ceilingPrice: ceiling ? '$' + (ceiling.p < 0.1 ? ceiling.p.toFixed(3) : ceiling.p.toFixed(2)) : null,
      ceiling: ceiling ? ceiling.r.model : null,
    };
  }, [annotated, frontier, dominated]);

  const readoutList = frontier
    .map(({ r, p }) => `${r.model}($${p < 0.1 ? p.toFixed(3) : p.toFixed(2)})`)
    .join(' → ');

  return (
    <div className="page">
      <Header />
      <FilterBar
        channels={Object.entries(DATA.channels)}
        vendors={Object.entries(DATA.vendors)}
        selCh={selCh} selVendor={selVendor}
        basis={basis} flags={flags}
        toggleCh={toggleCh} toggleVendor={toggleVendor}
        setChAll={setAll(setSelCh, CH_KEYS)} setChNone={() => {}}
        setVendorAll={setAll(setSelVendor, VENDOR_KEYS)} setVendorNone={() => {}}
        setBasis={setBasis} toggleFlag={toggleFlag} resetAll={resetAll}
        chCounts={chCounts} vendorCounts={vendorCounts}
      />

      <Section n={1} titleKey="sec.chart.title" subKey="sec.chart.sub" descKey="sec.chart.desc">
        <div className="card">
          <ErrorBoundary fallback={t('chart.error')}>
            <KillLineChart rows={annotated} basis={basis} labelsOn={flags.labels} focusOn={flags.focus} onReset={resetAll} />
          </ErrorBoundary>
        </div>
        <KpiRow kpis={kpis} />
        <p className="readout" dangerouslySetInnerHTML={{ __html: t('chart.readout', { n: frontier.length, list: readoutList }) }} />
      </Section>

      <Section n={2} titleKey="sec.spread.title" subKey="sec.spread.sub" descKey="sec.spread.desc">
        <ChannelSpread />
      </Section>

      <Section n={3} titleKey="sec.value.title" subKey="sec.value.sub" descKey="sec.value.desc">
        <ValueBoard />
      </Section>

      <Section n={4} titleKey="sec.table.title" subKey="sec.table.sub" descKey="sec.table.desc">
        <OfferingsTable rowsForTable={annotated} fIds={fIds} dominated={dominated} />
      </Section>

      <Section n={5} titleKey="sec.plans.title" subKey="sec.plans.sub" descKey="sec.plans.desc">
        <PlansSection />
      </Section>

      <Section n={6} titleKey="sec.method.title" subKey="sec.method.sub" descKey="">
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
