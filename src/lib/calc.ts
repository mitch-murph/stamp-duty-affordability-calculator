import { SCHEDULES } from './schedules';
import type { AffordabilityResult } from './types';

export function stampDuty(price: number, stateCode: string): number {
  if (!price || price <= 0) return 0;
  const sched = SCHEDULES[stateCode] ?? SCHEDULES['NSW'];
  for (const [upper, base, rate, above] of sched) {
    if (price <= upper) {
      if (above === 0 && base === 0) return price * rate;
      return base + (price - above) * rate;
    }
  }
  return 0;
}

export function calcAffordability(
  savings: number,
  depositPct: number,
  otherCosts: number,
  stateCode: string,
): AffordabilityResult {
  const target = savings - otherCosts;

  let property = 0;
  if (target > 0 && depositPct > 0) {
    let lo = 0, hi = 50_000_000;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (mid * depositPct + stampDuty(mid, stateCode) <= target) lo = mid;
      else hi = mid;
    }
    property = Math.round(lo);
  }

  const deposit = Math.round(property * depositPct);
  const duty = Math.round(stampDuty(property, stateCode));
  const used = deposit + duty + otherCosts;
  const leftover = Math.max(0, savings - used);

  return { property, deposit, duty, otherCosts, leftover };
}
