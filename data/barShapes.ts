/* ─── IS 2502 Bar Shape Definitions ─────────────────────────────── */

export type SegmentType = 'line' | 'arc' | 'hook';

export interface DrawSegment {
  type: SegmentType;
  /** For line: length param key. For arc/hook: angle in degrees */
  value: string | number;
  /** Direction change for arcs: 1 = left, -1 = right */
  direction?: 1 | -1;
  /** Hook type: '1A' (180°) or '1B' (90°) */
  hookType?: '1A' | '1B';
  /** Label to show on dimension line */
  label?: string;
}

export interface ShapeParam {
  key: string;
  label: string;
  description: string;
  min: number;
  max: number;
  default: number;
  step: number;
}

export type ShapeCategory = 'Straight' | 'Hooks' | 'Bends' | 'Stirrups' | 'Helical';

export interface BarShape {
  id: string;
  table: string;
  name: string;
  description: string;
  category: ShapeCategory;
  params: ShapeParam[];
  drawSegments: DrawSegment[];
  /** Cut length formula description */
  formulaDesc: string;
  /** Calculate cut length given params + bar size d + bend radius R */
  cutLength: (params: Record<string, number>, d: number, R: number) => number;
}

/* ─── Table II: Hook & Bend Allowances (mm) ────────────────────── */
/* Keyed by "barSize:steelGrade" */

export interface TableIIEntry {
  barSize: number;
  steelGrade: string;
  /** Minimum bend radius (Table XI value, multiples of d) */
  minBendRadiusMultiplier: number;
  /** Standard hook allowance H (mm) — Type 1A 180° hook */
  hookAllowance1A: number;
  /** Standard hook allowance H (mm) — Type 1B 90° hook */
  hookAllowance1B: number;
  /** Bend deduction per 90° bend (mm) */
  bendDeduction90: number;
}

export const TABLE_II: Record<string, TableIIEntry> = {
  '6:Fe415': { barSize: 6, steelGrade: 'Fe415', minBendRadiusMultiplier: 2, hookAllowance1A: 57, hookAllowance1B: 42, bendDeduction90: 5 },
  '8:Fe415': { barSize: 8, steelGrade: 'Fe415', minBendRadiusMultiplier: 2, hookAllowance1A: 76, hookAllowance1B: 56, bendDeduction90: 7 },
  '10:Fe415': { barSize: 10, steelGrade: 'Fe415', minBendRadiusMultiplier: 2, hookAllowance1A: 95, hookAllowance1B: 70, bendDeduction90: 8 },
  '12:Fe415': { barSize: 12, steelGrade: 'Fe415', minBendRadiusMultiplier: 2, hookAllowance1A: 114, hookAllowance1B: 84, bendDeduction90: 10 },
  '16:Fe415': { barSize: 16, steelGrade: 'Fe415', minBendRadiusMultiplier: 3, hookAllowance1A: 176, hookAllowance1B: 120, bendDeduction90: 18 },
  '20:Fe415': { barSize: 20, steelGrade: 'Fe415', minBendRadiusMultiplier: 3, hookAllowance1A: 220, hookAllowance1B: 150, bendDeduction90: 22 },
  '25:Fe415': { barSize: 25, steelGrade: 'Fe415', minBendRadiusMultiplier: 3, hookAllowance1A: 275, hookAllowance1B: 188, bendDeduction90: 28 },
  '28:Fe415': { barSize: 28, steelGrade: 'Fe415', minBendRadiusMultiplier: 4, hookAllowance1A: 352, hookAllowance1B: 232, bendDeduction90: 38 },
  '32:Fe415': { barSize: 32, steelGrade: 'Fe415', minBendRadiusMultiplier: 4, hookAllowance1A: 402, hookAllowance1B: 266, bendDeduction90: 44 },
  '36:Fe415': { barSize: 36, steelGrade: 'Fe415', minBendRadiusMultiplier: 4, hookAllowance1A: 452, hookAllowance1B: 299, bendDeduction90: 49 },
  '40:Fe415': { barSize: 40, steelGrade: 'Fe415', minBendRadiusMultiplier: 4, hookAllowance1A: 502, hookAllowance1B: 332, bendDeduction90: 55 },

  '6:Fe500': { barSize: 6, steelGrade: 'Fe500', minBendRadiusMultiplier: 2, hookAllowance1A: 57, hookAllowance1B: 42, bendDeduction90: 5 },
  '8:Fe500': { barSize: 8, steelGrade: 'Fe500', minBendRadiusMultiplier: 2, hookAllowance1A: 76, hookAllowance1B: 56, bendDeduction90: 7 },
  '10:Fe500': { barSize: 10, steelGrade: 'Fe500', minBendRadiusMultiplier: 2, hookAllowance1A: 95, hookAllowance1B: 70, bendDeduction90: 8 },
  '12:Fe500': { barSize: 12, steelGrade: 'Fe500', minBendRadiusMultiplier: 3, hookAllowance1A: 133, hookAllowance1B: 91, bendDeduction90: 14 },
  '16:Fe500': { barSize: 16, steelGrade: 'Fe500', minBendRadiusMultiplier: 4, hookAllowance1A: 208, hookAllowance1B: 136, bendDeduction90: 24 },
  '20:Fe500': { barSize: 20, steelGrade: 'Fe500', minBendRadiusMultiplier: 4, hookAllowance1A: 260, hookAllowance1B: 170, bendDeduction90: 30 },
  '25:Fe500': { barSize: 25, steelGrade: 'Fe500', minBendRadiusMultiplier: 4, hookAllowance1A: 325, hookAllowance1B: 213, bendDeduction90: 38 },
  '28:Fe500': { barSize: 28, steelGrade: 'Fe500', minBendRadiusMultiplier: 4, hookAllowance1A: 352, hookAllowance1B: 232, bendDeduction90: 38 },
  '32:Fe500': { barSize: 32, steelGrade: 'Fe500', minBendRadiusMultiplier: 4, hookAllowance1A: 402, hookAllowance1B: 266, bendDeduction90: 44 },
  '36:Fe500': { barSize: 36, steelGrade: 'Fe500', minBendRadiusMultiplier: 4, hookAllowance1A: 452, hookAllowance1B: 299, bendDeduction90: 49 },
  '40:Fe500': { barSize: 40, steelGrade: 'Fe500', minBendRadiusMultiplier: 4, hookAllowance1A: 502, hookAllowance1B: 332, bendDeduction90: 55 },

  '6:Fe250': { barSize: 6, steelGrade: 'Fe250', minBendRadiusMultiplier: 2, hookAllowance1A: 57, hookAllowance1B: 42, bendDeduction90: 5 },
  '8:Fe250': { barSize: 8, steelGrade: 'Fe250', minBendRadiusMultiplier: 2, hookAllowance1A: 76, hookAllowance1B: 56, bendDeduction90: 7 },
  '10:Fe250': { barSize: 10, steelGrade: 'Fe250', minBendRadiusMultiplier: 2, hookAllowance1A: 95, hookAllowance1B: 70, bendDeduction90: 8 },
  '12:Fe250': { barSize: 12, steelGrade: 'Fe250', minBendRadiusMultiplier: 2, hookAllowance1A: 114, hookAllowance1B: 84, bendDeduction90: 10 },
  '16:Fe250': { barSize: 16, steelGrade: 'Fe250', minBendRadiusMultiplier: 2, hookAllowance1A: 152, hookAllowance1B: 104, bendDeduction90: 14 },
  '20:Fe250': { barSize: 20, steelGrade: 'Fe250', minBendRadiusMultiplier: 2, hookAllowance1A: 190, hookAllowance1B: 130, bendDeduction90: 17 },
  '25:Fe250': { barSize: 25, steelGrade: 'Fe250', minBendRadiusMultiplier: 2, hookAllowance1A: 238, hookAllowance1B: 163, bendDeduction90: 21 },
  '28:Fe250': { barSize: 28, steelGrade: 'Fe250', minBendRadiusMultiplier: 3, hookAllowance1A: 308, hookAllowance1B: 204, bendDeduction90: 30 },
  '32:Fe250': { barSize: 32, steelGrade: 'Fe250', minBendRadiusMultiplier: 3, hookAllowance1A: 352, hookAllowance1B: 233, bendDeduction90: 35 },
  '36:Fe250': { barSize: 36, steelGrade: 'Fe250', minBendRadiusMultiplier: 3, hookAllowance1A: 396, hookAllowance1B: 262, bendDeduction90: 39 },
  '40:Fe250': { barSize: 40, steelGrade: 'Fe250', minBendRadiusMultiplier: 3, hookAllowance1A: 440, hookAllowance1B: 291, bendDeduction90: 43 },
};

/* ─── Table XI: Tolerances ──────────────────────────────────────── */

export function roundToNext25mm(value: number): number {
  return Math.ceil(value / 25) * 25;
}

/* ─── Shape Definitions (Tables III, V, VI, VIII, IX) ──────────── */

export const BAR_SHAPES: BarShape[] = [
  /* ── Table III: Straight Bars ──────────────────────────────── */
  {
    id: 'III-A',
    table: 'Table III',
    name: 'Straight Bar',
    description: 'Plain straight bar, no bends',
    category: 'Straight',
    params: [
      { key: 'l', label: 'l', description: 'Total length', min: 100, max: 12000, default: 1000, step: 25 },
    ],
    drawSegments: [
      { type: 'line', value: 'l', label: 'l' },
    ],
    formulaDesc: 'L = l',
    cutLength: (p) => p.l,
  },
  {
    id: 'III-B',
    table: 'Table III',
    name: 'Hooked One End',
    description: 'Straight bar with standard hook on one end (Type 1A)',
    category: 'Hooks',
    params: [
      { key: 'l', label: 'l', description: 'Length from hook to end', min: 100, max: 12000, default: 800, step: 25 },
    ],
    drawSegments: [
      { type: 'hook', value: 180, direction: 1, hookType: '1A', label: 'H' },
      { type: 'line', value: 'l', label: 'l' },
    ],
    formulaDesc: 'L = l + H',
    cutLength: (p, d, R) => {
      const key = `${d}:Fe415`;
      const entry = TABLE_II[key];
      const H = entry ? entry.hookAllowance1A : d * 9;
      return p.l + H;
    },
  },
  {
    id: 'III-C',
    table: 'Table III',
    name: 'Hooked Both Ends',
    description: 'Straight bar with standard hooks on both ends (Type 1A)',
    category: 'Hooks',
    params: [
      { key: 'l', label: 'l', description: 'Length between hooks', min: 100, max: 12000, default: 800, step: 25 },
    ],
    drawSegments: [
      { type: 'hook', value: 180, direction: 1, hookType: '1A', label: 'H' },
      { type: 'line', value: 'l', label: 'l' },
      { type: 'hook', value: 180, direction: -1, hookType: '1A', label: 'H' },
    ],
    formulaDesc: 'L = l + 2H',
    cutLength: (p, d, R) => {
      const key = `${d}:Fe415`;
      const entry = TABLE_II[key];
      const H = entry ? entry.hookAllowance1A : d * 9;
      return p.l + 2 * H;
    },
  },
  {
    id: 'III-D',
    table: 'Table III',
    name: '90° Bent One End',
    description: 'Straight bar with 90° bend on one end',
    category: 'Bends',
    params: [
      { key: 'l', label: 'l', description: 'Longer straight length', min: 100, max: 12000, default: 800, step: 25 },
      { key: 'B', label: 'B', description: 'Bent leg length', min: 50, max: 3000, default: 200, step: 25 },
    ],
    drawSegments: [
      { type: 'line', value: 'l', label: 'l' },
      { type: 'arc', value: 90, direction: 1 },
      { type: 'line', value: 'B', label: 'B' },
    ],
    formulaDesc: 'L = l + B',
    cutLength: (p) => p.l + p.B,
  },

  /* ── Table V: Bent Bars ────────────────────────────────────── */
  {
    id: 'V-A',
    table: 'Table V',
    name: 'Single Bend',
    description: 'Bar bent at one point at specified angle',
    category: 'Bends',
    params: [
      { key: 'A', label: 'A', description: 'Length of first leg', min: 100, max: 6000, default: 500, step: 25 },
      { key: 'E', label: 'E', description: 'Length of second leg', min: 100, max: 6000, default: 500, step: 25 },
    ],
    drawSegments: [
      { type: 'line', value: 'A', label: 'A' },
      { type: 'arc', value: 45, direction: 1 },
      { type: 'line', value: 'E', label: 'E' },
    ],
    formulaDesc: 'L = A + E − 0.5R − d',
    cutLength: (p, d, R) => p.A + p.E - 0.5 * R - d,
  },
  {
    id: 'V-B',
    table: 'Table V',
    name: 'Single Bend + Hooks',
    description: 'Bar bent at one point with hooks on both ends',
    category: 'Bends',
    params: [
      { key: 'A', label: 'A', description: 'Length of first leg', min: 100, max: 6000, default: 500, step: 25 },
      { key: 'E', label: 'E', description: 'Length of second leg', min: 100, max: 6000, default: 500, step: 25 },
    ],
    drawSegments: [
      { type: 'hook', value: 90, direction: 1, hookType: '1B', label: 'B' },
      { type: 'line', value: 'A', label: 'A' },
      { type: 'arc', value: 45, direction: -1 },
      { type: 'line', value: 'E', label: 'E' },
      { type: 'hook', value: 90, direction: 1, hookType: '1B', label: 'B' },
    ],
    formulaDesc: 'L = A + E − 0.5R − d + 2B',
    cutLength: (p, d, R) => {
      const key = `${d}:Fe415`;
      const entry = TABLE_II[key];
      const B = entry ? entry.hookAllowance1B : d * 7;
      return p.A + p.E - 0.5 * R - d + 2 * B;
    },
  },
  {
    id: 'V-C',
    table: 'Table V',
    name: 'Single Bend + Std Hooks',
    description: 'Bar bent at one point with standard 180° hooks on both ends',
    category: 'Bends',
    params: [
      { key: 'A', label: 'A', description: 'Length of first leg', min: 100, max: 6000, default: 500, step: 25 },
      { key: 'E', label: 'E', description: 'Length of second leg', min: 100, max: 6000, default: 500, step: 25 },
    ],
    drawSegments: [
      { type: 'hook', value: 180, direction: 1, hookType: '1A', label: 'H' },
      { type: 'line', value: 'A', label: 'A' },
      { type: 'arc', value: 45, direction: -1 },
      { type: 'line', value: 'E', label: 'E' },
      { type: 'hook', value: 180, direction: -1, hookType: '1A', label: 'H' },
    ],
    formulaDesc: 'L = A + E − 0.5R − d + 2H',
    cutLength: (p, d, R) => {
      const key = `${d}:Fe415`;
      const entry = TABLE_II[key];
      const H = entry ? entry.hookAllowance1A : d * 9;
      return p.A + p.E - 0.5 * R - d + 2 * H;
    },
  },

  /* ── Table VI: Closed Stirrups ─────────────────────────────── */
  {
    id: 'VI-E',
    table: 'Table VI',
    name: 'Rectangular Stirrup',
    description: 'Closed rectangular stirrup with hooks',
    category: 'Stirrups',
    params: [
      { key: 'l', label: 'l', description: 'Perimeter length (A+B+A+B)', min: 200, max: 6000, default: 800, step: 25 },
    ],
    drawSegments: [
      { type: 'hook', value: 180, direction: 1, hookType: '1A', label: 'H' },
      { type: 'line', value: 'qA', label: 'A' },
      { type: 'arc', value: 90, direction: -1 },
      { type: 'line', value: 'qB', label: 'B' },
      { type: 'arc', value: 90, direction: -1 },
      { type: 'line', value: 'qA', label: 'A' },
      { type: 'arc', value: 90, direction: -1 },
      { type: 'line', value: 'qB', label: 'B' },
      { type: 'hook', value: 180, direction: 1, hookType: '1A', label: 'H' },
    ],
    formulaDesc: 'L = l + 2H',
    cutLength: (p, d) => {
      const key = `${d}:Fe415`;
      const entry = TABLE_II[key];
      const H = entry ? entry.hookAllowance1A : d * 9;
      return p.l + 2 * H;
    },
  },

  /* ── Table VIII: Double Bent Bars ──────────────────────────── */
  {
    id: 'VIII-A',
    table: 'Table VIII',
    name: 'Crank Bar (Standard)',
    description: 'Double cranked bar with standard 45° bends',
    category: 'Bends',
    params: [
      { key: 'A', label: 'A', description: 'Total horizontal length', min: 200, max: 12000, default: 1000, step: 25 },
      { key: 'E', label: 'E', description: 'Crank height', min: 50, max: 2000, default: 150, step: 25 },
    ],
    drawSegments: [
      { type: 'line', value: 'segA', label: 'A/3' },
      { type: 'arc', value: 45, direction: 1 },
      { type: 'line', value: 'E', label: 'E' },
      { type: 'arc', value: 45, direction: -1 },
      { type: 'line', value: 'segA', label: 'A/3' },
      { type: 'arc', value: 45, direction: -1 },
      { type: 'line', value: 'E', label: 'E' },
      { type: 'arc', value: 45, direction: 1 },
      { type: 'line', value: 'segA', label: 'A/3' },
    ],
    formulaDesc: 'L = 2(A + E) + 24d',
    cutLength: (p, d) => 2 * (p.A + p.E) + 24 * d,
  },
  {
    id: 'VIII-B',
    table: 'Table VIII',
    name: 'Crank Bar (Modified)',
    description: 'Double cranked bar — modified allowance',
    category: 'Bends',
    params: [
      { key: 'A', label: 'A', description: 'Total horizontal length', min: 200, max: 12000, default: 1000, step: 25 },
      { key: 'E', label: 'E', description: 'Crank height', min: 50, max: 2000, default: 150, step: 25 },
    ],
    drawSegments: [
      { type: 'line', value: 'segA', label: 'A/3' },
      { type: 'arc', value: 45, direction: 1 },
      { type: 'line', value: 'E', label: 'E' },
      { type: 'arc', value: 45, direction: -1 },
      { type: 'line', value: 'segA', label: 'A/3' },
      { type: 'arc', value: 45, direction: -1 },
      { type: 'line', value: 'E', label: 'E' },
      { type: 'arc', value: 45, direction: 1 },
      { type: 'line', value: 'segA', label: 'A/3' },
    ],
    formulaDesc: 'L = 2(A + E) + 20d',
    cutLength: (p, d) => 2 * (p.A + p.E) + 20 * d,
  },

  /* ── Table IX: Helical ─────────────────────────────────────── */
  {
    id: 'IX-C',
    table: 'Table IX',
    name: 'Helical Bar',
    description: 'Helical / spiral reinforcement',
    category: 'Helical',
    params: [
      { key: 'D', label: 'D', description: 'Helix diameter (outer)', min: 100, max: 3000, default: 400, step: 25 },
      { key: 'N', label: 'N', description: 'Number of turns', min: 1, max: 50, default: 6, step: 1 },
    ],
    drawSegments: [
      { type: 'line', value: 'helix', label: 'Helix' },
    ],
    formulaDesc: 'L = Nπ(D + d) + 8d',
    cutLength: (p, d) => p.N * Math.PI * (p.D + d) + 8 * d,
  },
];

/** Available bar sizes (mm) */
export const BAR_SIZES = [6, 8, 10, 12, 16, 20, 25, 28, 32, 36, 40];

/** Steel grades */
export const STEEL_GRADES = ['Fe250', 'Fe415', 'Fe500'];

/** Shape categories for filtering */
export const SHAPE_CATEGORIES: ShapeCategory[] = ['Straight', 'Hooks', 'Bends', 'Stirrups', 'Helical'];
