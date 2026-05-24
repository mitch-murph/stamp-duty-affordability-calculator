import { useState } from 'react';

interface Props {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  id?: string;
  'aria-label'?: string;
}

export function MoneyInput({ value, onChange, max = 10_000_000, id, 'aria-label': ariaLabel }: Props) {
  const [focused, setFocused] = useState(false);
  const display = focused ? String(value) : Number(value).toLocaleString('en-AU');

  return (
    <div className={`money-input${focused ? ' focused' : ''}`}>
      <span className="money-prefix">$</span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={display}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, '');
          const n = raw === '' ? 0 : parseInt(raw, 10);
          onChange(Math.max(0, Math.min(max, n)));
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={ariaLabel}
      />
    </div>
  );
}
