interface Props {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
}

export function Slider({ value, onChange, min, max, step, format }: Props) {
  const pct = ((value - min) / (max - min)) * 100;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => min + (max - min) * t);

  return (
    <div className="slider-wrap">
      <input
        type="range"
        className="slider"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
      />
      <div className="slider-ticks" aria-hidden="true">
        {ticks.map((t, i) => (
          <span key={i}>{format ? format(t) : t}</span>
        ))}
      </div>
    </div>
  );
}
