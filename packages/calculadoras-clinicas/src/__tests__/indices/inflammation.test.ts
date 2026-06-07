import { describe, expect, it } from 'vitest';

import { calculateNLR, calculateSII } from '../../indices/formulas/inflammation';
import type { CalculatorInputs } from '../../indices/types';

describe('calculateSII', () => {
  /**
   * Reference: Hu B et al. Clinical Cancer Research 2014;20(23):6212-6222.
   * Formula: (Platelets x Neutrophils) / Lymphocytes
   * All in 10^9/L (absolute counts).
   *
   * Example: Platelets=250, Neutrophils=4.5, Lymphocytes=2.0
   * = (250 * 4.5) / 2.0
   * = 1125 / 2.0
   * = 562.5
   */
  it('should calculate correctly for a known example', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { Lymphocytes_Abs: 2.0, Neutrophils_Abs: 4.5, Platelets: 250 },
    };
    const result = calculateSII(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(562.5, 1);
  });

  it('should return low SII for healthy individual', () => {
    // Platelets=220, Neutrophils=3.0, Lymphocytes=2.5
    // = (220 * 3.0) / 2.5 = 264
    const inputs: CalculatorInputs = {
      biomarkers: { Lymphocytes_Abs: 2.5, Neutrophils_Abs: 3.0, Platelets: 220 },
    };
    const result = calculateSII(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(264, 0);
    expect(result!).toBeLessThan(530); // Normal range upper bound
  });

  it('should return high SII for inflammatory state', () => {
    // Platelets=350, Neutrophils=8.0, Lymphocytes=1.0
    // = (350 * 8.0) / 1.0 = 2800
    const inputs: CalculatorInputs = {
      biomarkers: { Lymphocytes_Abs: 1.0, Neutrophils_Abs: 8.0, Platelets: 350 },
    };
    const result = calculateSII(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(2800, 0);
    expect(result!).toBeGreaterThan(530);
  });

  it('should scale linearly with platelet count', () => {
    const base: CalculatorInputs = {
      biomarkers: { Lymphocytes_Abs: 2.0, Neutrophils_Abs: 4.0, Platelets: 200 },
    };
    const doubled: CalculatorInputs = {
      biomarkers: { Lymphocytes_Abs: 2.0, Neutrophils_Abs: 4.0, Platelets: 400 },
    };
    const baseResult = calculateSII(base)!;
    const doubledResult = calculateSII(doubled)!;
    expect(doubledResult).toBeCloseTo(baseResult * 2, 1);
  });

  describe('edge cases', () => {
    it('should return null when Platelets is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: 2.0, Neutrophils_Abs: 4.5 },
      };
      expect(calculateSII(inputs)).toBeNull();
    });

    it('should return null when Neutrophils is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: 2.0, Platelets: 250 },
      };
      expect(calculateSII(inputs)).toBeNull();
    });

    it('should return null when Lymphocytes is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Neutrophils_Abs: 4.5, Platelets: 250 },
      };
      expect(calculateSII(inputs)).toBeNull();
    });

    it('should return null when Lymphocytes is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: 0, Neutrophils_Abs: 4.5, Platelets: 250 },
      };
      expect(calculateSII(inputs)).toBeNull();
    });

    it('should return null when Lymphocytes is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: -1, Neutrophils_Abs: 4.5, Platelets: 250 },
      };
      expect(calculateSII(inputs)).toBeNull();
    });

    it('should handle zero Neutrophils (produces zero result)', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: 2.0, Neutrophils_Abs: 0, Platelets: 250 },
      };
      const result = calculateSII(inputs);
      expect(result).toBe(0);
    });

    it('should handle zero Platelets (produces zero result)', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: 2.0, Neutrophils_Abs: 4.5, Platelets: 0 },
      };
      const result = calculateSII(inputs);
      expect(result).toBe(0);
    });
  });
});

describe('calculateNLR', () => {
  /**
   * Reference: Forget P et al. BMC Research Notes 2017;10:12.
   * Formula: Neutrophils / Lymphocytes
   * Both in 10^9/L (absolute counts).
   *
   * Example: Neutrophils=4.0, Lymphocytes=2.0
   * = 4.0 / 2.0
   * = 2.0
   */
  it('should calculate correctly for a known example', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { Lymphocytes_Abs: 2.0, Neutrophils_Abs: 4.0 },
    };
    const result = calculateNLR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(2.0, 2);
  });

  it('should return normal NLR for healthy individual', () => {
    // Neutrophils=3.5, Lymphocytes=2.5 => 1.4
    const inputs: CalculatorInputs = {
      biomarkers: { Lymphocytes_Abs: 2.5, Neutrophils_Abs: 3.5 },
    };
    const result = calculateNLR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(1.4, 2);
    expect(result!).toBeLessThan(3.0); // Normal range
  });

  it('should return elevated NLR for systemic inflammation', () => {
    // Neutrophils=10.0, Lymphocytes=1.0 => 10.0
    const inputs: CalculatorInputs = {
      biomarkers: { Lymphocytes_Abs: 1.0, Neutrophils_Abs: 10.0 },
    };
    const result = calculateNLR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(10.0, 2);
    expect(result!).toBeGreaterThan(3.0);
  });

  it('should return 1.0 when neutrophils equals lymphocytes', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { Lymphocytes_Abs: 3.0, Neutrophils_Abs: 3.0 },
    };
    const result = calculateNLR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(1.0, 5);
  });

  describe('boundary: risk thresholds', () => {
    it('should produce value near the 3.0 elevated cutoff', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: 2.0, Neutrophils_Abs: 6.0 },
      };
      const result = calculateNLR(inputs);
      expect(result).not.toBeNull();
      expect(result!).toBeCloseTo(3.0, 2);
    });
  });

  describe('edge cases', () => {
    it('should return null when Neutrophils is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: 2.0 },
      };
      expect(calculateNLR(inputs)).toBeNull();
    });

    it('should return null when Lymphocytes is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Neutrophils_Abs: 4.0 },
      };
      expect(calculateNLR(inputs)).toBeNull();
    });

    it('should return null when Lymphocytes is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: 0, Neutrophils_Abs: 4.0 },
      };
      expect(calculateNLR(inputs)).toBeNull();
    });

    it('should return null when Lymphocytes is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: -1, Neutrophils_Abs: 4.0 },
      };
      expect(calculateNLR(inputs)).toBeNull();
    });

    it('should handle zero Neutrophils (produces zero result)', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Lymphocytes_Abs: 2.0, Neutrophils_Abs: 0 },
      };
      const result = calculateNLR(inputs);
      expect(result).toBe(0);
    });
  });
});
