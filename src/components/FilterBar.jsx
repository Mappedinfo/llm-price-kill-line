import React from 'react';
import { useI18n } from '../i18n/index.jsx';

/**
 * ChipGroup:一组可点选的 chip + 「全选 / 清空」
 * items: [{key,label,color?,count?,className?}]
 */
export function ChipGroup({ label, items, selected, onToggle, onAll, onNone }) {
  const { t } = useI18n();
  return (
    <div className="fgroup">
      <div className="fgroup-head">
        <span className="flabel">{label}</span>
        <span className="mini-actions">
          <button type="button" onClick={onAll}>{t('ctrl.all')}</button>
          <span className="sep">·</span>
          <button type="button" onClick={onNone}>{t('ctrl.none')}</button>
        </span>
      </div>
      <div className="chips-row">
        {items.map((it) => {
          const on = !!selected[it.key];
          return (
            <button
              key={it.key}
              type="button"
              className={'pill' + (on ? ' on' : '')}
              style={on && it.color ? { '--pc': it.color } : undefined}
              onClick={() => onToggle(it.key)}
            >
              {it.color ? <i className="dot" style={{ background: it.color }} /> : null}
              {it.label}
              {it.count != null && <em>{it.count}</em>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SegButtonGroup({ options, value, onChange }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.key} className={value === o.key ? 'on' : ''} onClick={() => onChange(o.key)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** 筛选区总成:渠道组、厂商组(均带全选/清空)、口径与杂项开关、重置 */
export default function FilterBar(props) {
  const { t } = useI18n();
  const {
    channels, vendors,
    selCh, selVendor, basis, flags,
    toggleCh, toggleVendor,
    setChAll, setChNone, setVendorAll, setVendorNone,
    setBasis, toggleFlag, resetAll,
    chCounts, vendorCounts,
  } = props;

  return (
    <div className="filterbar card">
      <div className="filterbar-main">
        <div className="filterbar-groups">
          <ChipGroup
            label={t('ctrl.channel')}
            items={channels.map(([k, c]) => ({ key: k, label: t('ch.' + k), count: chCounts[k] || 0 }))}
            selected={selCh}
            onToggle={toggleCh}
            onAll={() => setChAll(true)}
            onNone={() => setChAll(false)}
          />
          <ChipGroup
            label={t('ctrl.vendor')}
            items={vendors.map(([k, v]) => ({ key: k, label: t('vendor.' + k), color: v.color, count: vendorCounts[k] || 0 }))}
            selected={selVendor}
            onToggle={toggleVendor}
            onAll={() => setVendorAll(true)}
            onNone={() => setVendorAll(false)}
          />
        </div>

        <div className="filterbar-side">
          <div className="fgroup">
            <div className="fgroup-head"><span className="flabel">{t('ctrl.basis')}</span></div>
            <SegButtonGroup
              value={basis}
              onChange={setBasis}
              options={['blended', 'in', 'out'].map((k) => ({ key: k, label: t('ctrl.basis.' + k) }))}
            />
          </div>
          <div className="fgroup">
            <div className="fgroup-head">
              <span className="flabel">{t('ctrl.resetAll')}</span>
            </div>
            <div className="misc-row">
              {['dep', 'free', 'noTrain', 'labels', 'focus'].map((m) => (
                <button key={m} className={'pill slim' + (flags[m] ? ' on' : '')} onClick={() => toggleFlag(m)}>
                  {t('ctrl.' + m)}
                </button>
              ))}
              <button className="reset" onClick={resetAll}>↺</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
