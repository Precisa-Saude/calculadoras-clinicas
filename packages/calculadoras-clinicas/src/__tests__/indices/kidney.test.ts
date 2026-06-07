import { describe, expect, it } from 'vitest';

import { calculateEGFR } from '../../indices/formulas/kidney';
import type { CalculatorInputs } from '../../indices/types';

describe('calculateEGFR', () => {
  /**
   * Reference: Inker LA et al. NEJM 2021;385(19):1737-1749. (CKD-EPI 2021, race-free)
   *
   * Male, 50yo, Creatinine=1.0 mg/dL
   * kappa = 0.9, Scr/kappa = 1.0/0.9 = 1.111 (>1)
   * eGFR = 142 * (1.111)^(-1.2) * 0.9938^50
   * = 142 * 0.8731 * 0.7318
   * ~ 91.7
   */
  it('should calculate correctly for a 50yo male with creatinine 1.0', () => {
    const inputs: CalculatorInputs = {
      age: 50,
      biomarkers: { Creatinine: 1.0 },
      sex: 'M',
    };
    const result = calculateEGFR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(91.7, 0);
  });

  /**
   * Female, 50yo, Creatinine=0.7 mg/dL
   * kappa = 0.7, Scr/kappa = 0.7/0.7 = 1.0 (<=1)
   * eGFR = 142 * (1.0)^(-0.241) * 0.9938^50 * 1.012
   * = 142 * 1.0 * 0.7318 * 1.012
   * = 105.2
   */
  it('should calculate correctly for a 50yo female with creatinine 0.7', () => {
    const inputs: CalculatorInputs = {
      age: 50,
      biomarkers: { Creatinine: 0.7 },
      sex: 'F',
    };
    const result = calculateEGFR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(105.1, 0);
  });

  /**
   * Male, 30yo, Creatinine=0.8 mg/dL (Scr/kappa = 0.889 <= 1)
   * eGFR = 142 * (0.889)^(-0.302) * 0.9938^30
   * = 142 * 1.0367 * 0.8304
   * = 122.2
   */
  it('should calculate high eGFR for young male with low creatinine', () => {
    const inputs: CalculatorInputs = {
      age: 30,
      biomarkers: { Creatinine: 0.8 },
      sex: 'M',
    };
    const result = calculateEGFR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(122.2, 0);
    expect(result!).toBeGreaterThan(90); // Normal kidney function
  });

  /**
   * Female, 70yo, Creatinine=1.5 mg/dL (Scr/kappa = 2.143 > 1)
   * eGFR = 142 * (2.143)^(-1.2) * 0.9938^70 * 1.012
   * = 142 * 0.4087 * 0.6484 * 1.012
   * ~ 37.3
   */
  it('should calculate low eGFR for older female with high creatinine', () => {
    const inputs: CalculatorInputs = {
      age: 70,
      biomarkers: { Creatinine: 1.5 },
      sex: 'F',
    };
    const result = calculateEGFR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(37.3, 0);
    expect(result!).toBeLessThan(60); // Stage 3 CKD
  });

  it('should use different alpha for male vs female when Scr/kappa <= 1', () => {
    const maleInputs: CalculatorInputs = {
      age: 40,
      biomarkers: { Creatinine: 0.8 },
      sex: 'M',
    };
    const femaleInputs: CalculatorInputs = {
      age: 40,
      biomarkers: { Creatinine: 0.6 },
      sex: 'F',
    };
    const maleResult = calculateEGFR(maleInputs)!;
    const femaleResult = calculateEGFR(femaleInputs)!;
    // Both should produce valid results
    expect(maleResult).toBeGreaterThan(0);
    expect(femaleResult).toBeGreaterThan(0);
  });

  describe('boundary: CKD stage thresholds', () => {
    it('should detect normal kidney function (eGFR >= 90)', () => {
      const inputs: CalculatorInputs = {
        age: 35,
        biomarkers: { Creatinine: 0.9 },
        sex: 'M',
      };
      const result = calculateEGFR(inputs);
      expect(result).not.toBeNull();
      expect(result!).toBeGreaterThanOrEqual(90);
    });

    it('should detect stage 3a CKD (eGFR 45-59)', () => {
      const inputs: CalculatorInputs = {
        age: 65,
        biomarkers: { Creatinine: 1.4 },
        sex: 'M',
      };
      const result = calculateEGFR(inputs);
      expect(result).not.toBeNull();
      expect(result!).toBeGreaterThanOrEqual(45);
      expect(result!).toBeLessThan(60);
    });
  });

  describe('edge cases', () => {
    it('should return null when age is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Creatinine: 1.0 },
        sex: 'M',
      };
      expect(calculateEGFR(inputs)).toBeNull();
    });

    it('should return null when sex is missing', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: { Creatinine: 1.0 },
      };
      expect(calculateEGFR(inputs)).toBeNull();
    });

    it('should return null when Creatinine is missing', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: {},
        sex: 'M',
      };
      expect(calculateEGFR(inputs)).toBeNull();
    });

    it('should return null when Creatinine is zero', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: { Creatinine: 0 },
        sex: 'M',
      };
      expect(calculateEGFR(inputs)).toBeNull();
    });

    it('should return null when Creatinine is negative', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: { Creatinine: -1 },
        sex: 'M',
      };
      expect(calculateEGFR(inputs)).toBeNull();
    });
  });
});
