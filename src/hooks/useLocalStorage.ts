import { useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const set = (v: T) => {
    setValue(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* quota exceeded */ }
  };

  return [value, set] as const;
}
