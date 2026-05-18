import type { State, Bracket } from './types';

export const STATES: State[] = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA',  name: 'Western Australia' },
  { code: 'SA',  name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
];

// General rates for owner-occupier residential purchases (non-first-home-buyer).
// Excludes first-home buyer concessions, foreign buyer surcharges, and
// off-the-plan concessions. For estimation only.
//
// Sources (verified 2025–26):
//   NSW — revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty
//   VIC — sro.vic.gov.au (non-principal place of residence rates)
//   QLD — qro.qld.gov.au/duties/transfer-duty/calculate/rates/
//   WA  — wa.gov.au (general transfer duty rates)
//   SA  — revenuesa.sa.gov.au/stamp-duty-land/rate-of-stamp-duty
//   TAS — sro.tas.gov.au/property-transfer-duties/rates-of-duty
//
// ACT and NT are excluded: ACT rates have changed significantly and the
// design data was stale; NT uses a quadratic formula below $525k that
// cannot be accurately represented with linear brackets.
//
// Format: [upperBound, base, rate, marginalAbove]
// When base === 0 && marginalAbove === 0: duty = price * rate (flat on full price)
export const SCHEDULES: Record<string, Bracket[]> = {
  NSW: [
    // Source: revenue.nsw.gov.au — rates effective 1 July 2025
    // Note: $20 minimum duty applies below $1,600; irrelevant for property purchases.
    [17000,    0,     0.0125, 0],
    [37000,    212,   0.015,  17000],
    [99000,    512,   0.0175, 37000],
    [372000,   1597,  0.035,  99000],
    [1240000,  11152, 0.045,  372000],
    [Infinity, 50212, 0.055,  1240000],
  ],
  VIC: [
    // Source: sro.vic.gov.au — non-PPR rates, effective 1 July 2021
    // $960k–$2M: 5.5% flat on full purchase price (not marginal)
    [25000,    0,      0.014,  0],
    [130000,   350,    0.024,  25000],
    [960000,   2870,   0.06,   130000],
    [2000000,  0,      0.055,  0],
    [Infinity, 110000, 0.065,  2000000],
  ],
  QLD: [
    // Source: qro.qld.gov.au/duties/transfer-duty/calculate/rates/
    [5000,     0,     0,      0],
    [75000,    0,     0.015,  5000],
    [540000,   1050,  0.035,  75000],
    [1000000,  17325, 0.045,  540000],
    [Infinity, 38025, 0.0575, 1000000],
  ],
  WA: [
    // Source: wa.gov.au — general transfer duty rates
    [120000,   0,     0.019,  0],
    [150000,   2280,  0.0285, 120000],
    [360000,   3135,  0.038,  150000],
    [725000,   11115, 0.0475, 360000],
    [Infinity, 28453, 0.0515, 725000],
  ],
  SA: [
    // Source: revenuesa.sa.gov.au — rates unchanged since 2012
    [12000,    0,     0.01,   0],
    [30000,    120,   0.02,   12000],
    [50000,    480,   0.03,   30000],
    [100000,   1080,  0.035,  50000],
    [200000,   2830,  0.04,   100000],
    [250000,   6830,  0.0425, 200000],
    [300000,   8955,  0.0475, 250000],
    [500000,   11330, 0.05,   300000],
    [Infinity, 21330, 0.055,  500000],
  ],
  TAS: [
    // Source: sro.tas.gov.au — rates effective 21 October 2013
    [3000,     50,    0,      0],
    [25000,    50,    0.0175, 3000],
    [75000,    435,   0.0225, 25000],
    [200000,   1560,  0.035,  75000],
    [375000,   5935,  0.04,   200000],
    [725000,   12935, 0.0425, 375000],
    [Infinity, 27810, 0.045,  725000],
  ],
};
