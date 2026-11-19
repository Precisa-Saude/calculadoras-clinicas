/**
 * Unit Converters for PhenoAge Calculator
 *
 * Brazilian labs (Weinmann, Fleury, etc.) often report in different units
 * than the SI units required by the PhenoAge algorithm.
 */

/**
 * Conversion factors for each biomarker
 * Key: source unit, Value: multiplier to get SI unit
 */
export const CONVERSION_FACTORS: Record<string, Record<string, number>> = {
  albumin: {
    'g/dL': 10, // g/dL → g/L
    'g/L': 1,
  },
  alkalinePhosphatase: {
    'U/L': 1,
  },
  creatinine: {
    'mg/dL': 88.4, // mg/dL → μmol/L
    'umol/L': 1,
    'μmol/L': 1,
  },
  crp: {
    'mg/dL': 10, // mg/dL → mg/L
    'mg/L': 1,
  },
  glucose: {
    'mg/dL': 1 / 18.0182, // mg/dL → mmol/L
    'mmol/L': 1,
  },
  lymphocytePercent: {
    '%': 1,
  },
  mcv: {
    fL: 1,
  },
  rdw: {
    '%': 1,
  },
  wbc: {
    '/uL': 0.001,
    '/µL': 0.001, // cells/μL → 10^9/L
    '10^9/L': 1,
    '1000/μL': 1,
    '10³/µL': 1, // Same as 10^9/L
    'K/uL': 1,
    'K/µL': 1,
    'Thousand/uL': 1, // Brazilian labs often use this format
    'thousand/uL': 1,
    'Thousand/µL': 1,
    'thousand/µL': 1,
  },
};

/**
 * Target units for PhenoAge calculation (SI units)
 */
export const TARGET_UNITS: Record<string, string> = {
  albumin: 'g/L',
  alkalinePhosphatase: 'U/L',
  creatinine: 'μmol/L',
  crp: 'mg/L',
  glucose: 'mmol/L',
  lymphocytePercent: '%',
  mcv: 'fL',
  rdw: '%',
  wbc: '10^9/L',
};

/**
 * Convert a biomarker value from source unit to SI unit
 *
 * @param biomarker - The biomarker key (e.g., 'albumin', 'glucose')
 * @param value - The numeric value
 * @param sourceUnit - The unit of the input value
 * @returns Converted value in SI units
 * @throws Error if the unit is not recognized
 */
export const convertToSI = (biomarker: string, value: number, sourceUnit: string): number => {
  const factors = CONVERSION_FACTORS[biomarker];

  if (!factors) {
    throw new Error(`Unknown biomarker: ${biomarker}`);
  }

  // Normalize unit string for matching
  const normalizedUnit = sourceUnit.trim();
  const factor = factors[normalizedUnit];
  if (factor !== undefined) return value * factor;

  // Comparação pela forma canônica (ver `canonicalUnit`). Sem isso,
  // `Thousand /uL` e `10^3/uL` caíam na busca parcial por `/uL`, o fator das
  // células por µL, e 5,3 virava 0,0053.
  const canonical = canonicalUnit(normalizedUnit);
  const table = canonicalFactors(biomarker, factors);
  const exact = table.get(canonical);
  if (exact !== undefined) return value * exact;

  // Unidade com prefixo de grandeza que a forma canônica não reconheceu não
  // passa pela busca parcial: ela acharia o `/ul` dentro dela e erraria por
  // mil. O erro devolve a decisão ao `autoConvertToSI`, que usa a faixa do valor.
  if (MAGNITUDE.test(canonical)) {
    throw new Error(`Unknown unit "${sourceUnit}" for ${biomarker}`);
  }

  // For partial matches, prefer the longest key to pick the most specific one
  // ("10³/µL" before "/µL").
  const partial = [...table.keys()]
    .filter((key) => key.length > 1)
    .sort((a, b) => b.length - a.length)
    .find((key) => canonical.includes(key));
  if (partial !== undefined) return value * table.get(partial)!;

  throw new Error(`Unknown unit "${sourceUnit}" for ${biomarker}`);
};

/** Prefixo de grandeza que sobrou depois da forma canônica. */
const MAGNITUDE = /\d|thousand|mil\b|^k/;

/**
 * A grafia de comparação de uma unidade: minúscula, sem espaço, `µ` como `u`,
 * sem a palavra `cells`/`células`, `mm³` como `ul` (1 mm³ é 1 µL) e os
 * prefixos de milhar (`Thousand(s)`, `10^3`, `10³`, `10E3`, `1000`, `mil`, `K`)
 * como `k`.
 */
const canonicalUnit = (unit: string): string =>
  unit
    .toLowerCase()
    .replace(/c[eé]lulas?|cells?/g, '')
    .replace(/\s+/g, '')
    .replace(/[µμ]/g, 'u')
    .replace(/^[·x×*]/, '')
    .replace(/³/g, '^3')
    .replace(/^(?:10(?:\^|\*\*|\*|e)3|1000|thousands?|mil|k)(?=\/)/, 'k')
    .replace(/mm\^?3$/, 'ul');

const canonicalCache = new Map<string, Map<string, number>>();

/**
 * A tabela de um biomarcador pela forma canônica, montada uma vez. Duas
 * grafias com a mesma forma e fatores diferentes são erro da tabela, e não
 * escolha de quem chega primeiro.
 */
const canonicalFactors = (
  biomarker: string,
  factors: Record<string, number>,
): Map<string, number> => {
  const cached = canonicalCache.get(biomarker);
  if (cached) return cached;
  const table = new Map<string, number>();
  for (const [unit, factor] of Object.entries(factors)) {
    const key = canonicalUnit(unit);
    const previous = table.get(key);
    if (previous !== undefined && previous !== factor) {
      throw new Error(`Conflicting factors for "${key}" in ${biomarker}`);
    }
    table.set(key, factor);
  }
  canonicalCache.set(biomarker, table);
  return table;
};

/**
 * Check if a value needs conversion
 *
 * @param biomarker - The biomarker key
 * @param sourceUnit - The current unit
 * @returns true if conversion is needed
 */
export const needsConversion = (biomarker: string, sourceUnit: string): boolean => {
  const targetUnit = TARGET_UNITS[biomarker];
  if (!targetUnit) return false;

  const normalizedSource = sourceUnit.trim().toLowerCase();
  const normalizedTarget = targetUnit.toLowerCase();

  return normalizedSource !== normalizedTarget;
};

/**
 * Auto-detect unit and convert to SI if needed
 * Uses heuristics based on typical value ranges
 *
 * @param biomarker - The biomarker key
 * @param value - The numeric value
 * @param unit - Optional unit hint
 * @returns Object with converted value and detected unit
 */
export const autoConvertToSI = (
  biomarker: string,
  value: number,
  unit?: string,
): { value: number; unit: string; wasConverted: boolean } => {
  // If unit is provided and we know how to convert it
  if (unit) {
    try {
      const converted = convertToSI(biomarker, value, unit);
      const wasConverted = needsConversion(biomarker, unit);
      return {
        unit: TARGET_UNITS[biomarker] || unit,
        value: converted,
        wasConverted,
      };
    } catch {
      // Fall through to heuristic detection
    }
  }

  // Heuristic-based detection for common cases
  switch (biomarker) {
    case 'albumin':
      // g/dL typically 3-5, g/L typically 30-50
      if (value < 10) {
        return { unit: 'g/L', value: value * 10, wasConverted: true };
      }
      return { unit: 'g/L', value, wasConverted: false };

    case 'creatinine':
      // mg/dL typically 0.5-1.5, μmol/L typically 45-130
      if (value < 15) {
        return { unit: 'μmol/L', value: value * 88.4, wasConverted: true };
      }
      return { unit: 'μmol/L', value, wasConverted: false };

    case 'glucose':
      // mg/dL typically 70-140, mmol/L typically 4-8
      if (value > 20) {
        return { unit: 'mmol/L', value: value / 18.0182, wasConverted: true };
      }
      return { unit: 'mmol/L', value, wasConverted: false };

    case 'wbc':
      // cells/μL typically 4000-11000, 10^9/L typically 4-11
      if (value > 100) {
        return { unit: '10^9/L', value: value / 1000, wasConverted: true };
      }
      return { unit: '10^9/L', value, wasConverted: false };

    default:
      return { unit: TARGET_UNITS[biomarker] || '', value, wasConverted: false };
  }
};
