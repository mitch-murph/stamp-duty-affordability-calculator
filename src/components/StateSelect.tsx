import { useState, useEffect, useRef } from 'react';
import { STATES } from '../lib/schedules';

interface Props {
  value: string;
  onChange: (code: string) => void;
}

export function StateSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = STATES.find((s) => s.code === value) ?? STATES[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="state-select" ref={ref}>
      <button
        type="button"
        className={`state-btn${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="state-code">{selected.code}</span>
        <span className="state-name">{selected.name}</span>
        <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="state-menu" role="listbox" aria-label="Select state">
          {STATES.map((s) => (
            <button
              key={s.code}
              type="button"
              role="option"
              aria-selected={s.code === value}
              className={`state-opt${s.code === value ? ' selected' : ''}`}
              onClick={() => { onChange(s.code); setOpen(false); }}
            >
              <span className="state-code">{s.code}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
