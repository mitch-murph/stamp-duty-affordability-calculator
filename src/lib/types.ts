export interface State {
  code: string;
  name: string;
}

// [upperBound, base, rate, marginalAbove]
// Special case: when base === 0 && marginalAbove === 0 → flat rate on full price
export type Bracket = [number, number, number, number];

export interface AffordabilityResult {
  property: number;
  deposit: number;
  duty: number;
  otherCosts: number;
  leftover: number;
}
