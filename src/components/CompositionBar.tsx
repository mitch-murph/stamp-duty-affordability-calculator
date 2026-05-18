import { useState } from 'react';

interface Segment {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface Props {
  deposit: number;
  duty: number;
  other: number;
  total: number;
  accent: string;
}

function fmt(n: number) {
  return '$' + Math.max(0, Math.round(n)).toLocaleString('en-AU');
}

export function CompositionBar({ deposit, duty, other, total, accent }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const sum = total || 1;

  const segs: Segment[] = [
    { key: 'deposit', label: 'Deposit',    value: deposit, color: accent },
    { key: 'duty',    label: 'Stamp duty', value: duty,    color: 'rgba(0,0,0,0.78)' },
    { key: 'other',   label: 'Other',      value: other,   color: 'rgba(0,0,0,0.34)' },
  ];

  const active = hovered !== null ? segs[hovered] : null;

  return (
    <div className="comp-bar-wrap">
      <div className="comp-bar" role="img" aria-label="Cost breakdown bar">
        {segs.map((s, i) => (
          <div
            key={s.key}
            className="comp-seg"
            style={{
              width: `${(s.value / sum) * 100}%`,
              background: s.color,
              transitionDelay: `${i * 40}ms`,
              opacity: hovered !== null && hovered !== i ? 0.35 : 1,
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>

      <div className="comp-hover-label" style={{ opacity: active ? 1 : 0 }}>
        {active && (
          <>
            <span className="comp-hover-dot" style={{ background: active.color }} />
            <span className="comp-hover-name">{active.label}</span>
            <span className="comp-hover-sep">·</span>
            <span className="comp-hover-val mono">{fmt(active.value)}</span>
          </>
        )}
      </div>
    </div>
  );
}
