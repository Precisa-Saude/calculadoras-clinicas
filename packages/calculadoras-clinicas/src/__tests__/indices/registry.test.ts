import { describe, expect, it } from 'vitest';

import { ADVANCED_CALCULATORS } from '../../indices/advanced-details';
import { CALCULATOR_REGISTRY, DOMAIN_LABELS } from '../../indices/registry';
import { getRiskLevelForValue } from '../../indices/types';

const EXPECTED_IDS = [
  'fib4',
  'apri',
  'fli',
  'aip',
  'castelli-i',
  'castelli-ii',
  'ascvd',
  'tyg',
  'homa-ir',
  'egfr',
  'sii',
  'nlr',
];

describe('CALCULATOR_REGISTRY', () => {
  it('exposes the 12 clinical indices', () => {
    expect(CALCULATOR_REGISTRY).toHaveLength(12);
    expect(CALCULATOR_REGISTRY.map((c) => c.id).sort()).toEqual([...EXPECTED_IDS].sort());
  });

  it('every calculator references a known domain', () => {
    for (const calc of CALCULATOR_REGISTRY) {
      expect(DOMAIN_LABELS[calc.domain]).toBeDefined();
    }
  });

  it('every calculator carries required metadata', () => {
    for (const calc of CALCULATOR_REGISTRY) {
      expect(calc.name).toBeTruthy();
      expect(calc.description).toBeTruthy();
      expect(calc.detail).toBeTruthy();
      expect(calc.formula).toBeTruthy();
      expect(calc.requiredBiomarkers.length).toBeGreaterThan(0);
      expect(Array.isArray(calc.references)).toBe(true);
      expect(Array.isArray(calc.recommendations)).toBe(true);
      expect(calc.riskZones.length).toBeGreaterThan(0);
    }
  });

  it('exercises formatValue and getRiskZones for every calculator', () => {
    for (const calc of CALCULATOR_REGISTRY) {
      if (calc.formatValue) {
        expect(typeof calc.formatValue(1.2345)).toBe('string');
      }
      if (calc.getRiskZones) {
        expect(calc.getRiskZones('F').length).toBeGreaterThan(0);
        expect(calc.getRiskZones('M').length).toBeGreaterThan(0);
      }
    }
  });
});

describe('getRiskLevelForValue', () => {
  const zones = CALCULATOR_REGISTRY.find((c) => c.id === 'fib4')!.riskZones;

  it('maps a value to its zone level', () => {
    expect(getRiskLevelForValue(0.5, zones)).toBe('low');
    expect(getRiskLevelForValue(2, zones)).toBe('moderate');
    expect(getRiskLevelForValue(3, zones)).toBe('high');
  });

  it('returns undefined for an out-of-range value', () => {
    expect(getRiskLevelForValue(999, zones)).toBeUndefined();
  });
});

describe('ADVANCED_CALCULATORS', () => {
  it('lists the advanced cards', () => {
    const ids = ADVANCED_CALCULATORS.map((c) => c.id);
    expect(ids).toContain('phenoage');
    expect(ids).toContain('brdmrisc');
  });
});
