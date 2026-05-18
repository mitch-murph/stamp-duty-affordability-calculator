import { useState, useMemo } from 'react';
import { StateSelect } from './components/StateSelect';
import { MoneyInput } from './components/MoneyInput';
import { Slider } from './components/Slider';
import { CompositionBar } from './components/CompositionBar';
import { WorkingOut } from './components/WorkingOut';
import { calcAffordability } from './lib/calc';
import { useSpring } from './hooks/useSpring';

const ACCENT = '#3d6b4a';

function fmtAUD(n: number) {
  return '$' + Math.max(0, Math.round(n)).toLocaleString('en-AU');
}
function fmtAUDsmall(n: number) {
  return Math.max(0, Math.round(n)).toLocaleString('en-AU');
}

export function App() {
  const [stateCode, setStateCode] = useState('NSW');
  const [savings, setSavings] = useState(150000);
  const [depositPct, setDepositPct] = useState(10);
  const [otherCosts, setOtherCosts] = useState(5000);

  const result = useMemo(
    () => calcAffordability(savings, depositPct / 100, otherCosts, stateCode),
    [savings, depositPct, otherCosts, stateCode],
  );

  const animProperty = useSpring(result.property);
  const animDeposit  = useSpring(result.deposit);
  const animDuty     = useSpring(result.duty);

  return (
    <div className="app" style={{ '--accent': ACCENT } as React.CSSProperties}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"
                    fill="none" stroke="currentColor" strokeWidth="1.6"
                    strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">Stamp Duty Affordability</div>
            <div className="brand-sub">Estimator · AU</div>
          </div>
        </div>
      </header>

      <main className="layout">
        {/* ── Inputs ── */}
        <section className="panel inputs-panel" aria-label="Purchase inputs">
          <div className="panel-head">
            <h2>Your purchase</h2>
            <p>Tell us where you're buying and what you've got saved.</p>
          </div>

          <div className="field">
            <div className="field-label">
              <span>Where you're buying</span>
            </div>
            <StateSelect value={stateCode} onChange={setStateCode} />
          </div>

          <div className="field">
            <div className="field-label">
              <span>Savings</span>
              <span className="field-hint">Total cash available, including deposit</span>
            </div>
            <MoneyInput value={savings} onChange={setSavings} max={5_000_000} />
            <Slider
              value={savings} onChange={setSavings}
              min={5000} max={500000} step={1000}
              format={(v) => v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`}
            />
          </div>

          <div className="field">
            <div className="field-label">
              <span>Deposit</span>
              <span className="field-hint">{depositPct}% of property price</span>
            </div>
            <div className="pct-input">
              <input
                type="number"
                value={depositPct}
                min={5} max={50} step={1}
                onChange={(e) =>
                  setDepositPct(Math.max(5, Math.min(50, Number(e.target.value) || 5)))
                }
                aria-label="Deposit percentage"
              />
              <span className="pct-suffix">%</span>
            </div>
            <Slider
              value={depositPct} onChange={setDepositPct}
              min={5} max={40} step={1}
              format={(v) => `${v}%`}
            />
            <div className="pct-presets" role="group" aria-label="Deposit percentage presets">
              {[5, 10, 20, 30].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`preset${depositPct === p ? ' on' : ''}`}
                  onClick={() => setDepositPct(p)}
                  aria-pressed={depositPct === p}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <span>Other costs</span>
              <span className="field-hint">Conveyancing, inspections, LMI buffer</span>
            </div>
            <MoneyInput value={otherCosts} onChange={setOtherCosts} max={100000} />
          </div>
        </section>

        {/* ── Results ── */}
        <section className="panel results-panel" aria-label="Results">
          <div className="results-head">
            <div className="results-eyebrow">Estimated buying power</div>
            <div className="big-number" aria-live="polite" aria-atomic="true">
              <span className="big-currency">$</span>
              <span className="big-value mono">
                {fmtAUDsmall(animProperty)}
              </span>
            </div>
            <p className="results-summary">
              You could afford a property up to{' '}
              <strong>{fmtAUD(result.property)}</strong>, resulting in{' '}
              <strong>{fmtAUD(result.duty)}</strong> in stamp duty and a{' '}
              <strong>{depositPct}%</strong> deposit of{' '}
              <strong>{fmtAUD(result.deposit)}</strong>.
            </p>
          </div>

          <CompositionBar
            deposit={result.deposit}
            duty={result.duty}
            other={result.otherCosts}
            total={result.deposit + result.duty + result.otherCosts + result.leftover}
            accent={ACCENT}
          />

          <WorkingOut
            deposit={result.deposit}
            duty={result.duty}
            other={result.otherCosts}
            leftover={result.leftover}
            savings={savings}
            animDeposit={animDeposit}
            animDuty={animDuty}
          />
        </section>
      </main>

      <footer className="disclaimer" role="contentinfo">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 6v4M7 4v.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span>
          Covers NSW, VIC, QLD, WA, SA and TAS using general (non-first-home-buyer) rates
          verified May 2026. Excludes first-home buyer concessions, foreign buyer surcharges,
          and off-the-plan rates. Not financial advice.
        </span>
      </footer>
    </div>
  );
}
