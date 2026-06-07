import { describe, expect, it } from 'vitest';

import { calculateHOMAIR, calculateTyG } from '../../indices/formulas/insulin-resistance';
import type { CalculatorInputs } from '../../indices/types';

describe('calculateTyG', () => {
  /**
   * Reference: Simental-Mendia LE et al. Metabolic Syndrome and Related Disorders 2008;6(4):299-304.
   * Formula: ln(Fasting TG x Fasting Glucose / 2)
   * Both values in mg/dL.
   *
   * Example: TG=150, Glucose=100
   * = ln(150 * 100 / 2)
   * = ln(7500)
   * = 8.9227
   */
  it('should calculate correctly for a known example', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { Glucose: 100, Triglycerides: 150 },
    };
    const result = calculateTyG(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(8.923, 2);
  });

  it('should return low-risk value for normal TG and glucose', () => {
    // TG=80, Glucose=85 => ln(80*85/2) = ln(3400) = 8.132
    const inputs: CalculatorInputs = {
      biomarkers: { Glucose: 85, Triglycerides: 80 },
    };
    const result = calculateTyG(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(8.132, 2);
    expect(result!).toBeLessThan(8.5); // Below typical cutoff for insulin resistance
  });

  it('should return high-risk value for elevated TG and glucose', () => {
    // TG=250, Glucose=130 => ln(250*130/2) = ln(16250) = 9.695
    const inputs: CalculatorInputs = {
      biomarkers: { Glucose: 130, Triglycerides: 250 },
    };
    const result = calculateTyG(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(9.695, 2);
    expect(result!).toBeGreaterThan(8.5);
  });

  describe('boundary: threshold values', () => {
    it('should produce value near the 8.5 cutoff', () => {
      // Want ln(TG*Glucose/2) = 8.5 => TG*Glucose/2 = e^8.5 = 4914.77 => TG*Glucose = 9829.54
      // TG=100, Glucose=98.3 => ln(100*98.3/2) = ln(4915) ~ 8.5
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: 98.3, Triglycerides: 100 },
      };
      const result = calculateTyG(inputs);
      expect(result).not.toBeNull();
      expect(result!).toBeCloseTo(8.5, 1);
    });
  });

  describe('edge cases', () => {
    it('should return null when Triglycerides is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: 100 },
      };
      expect(calculateTyG(inputs)).toBeNull();
    });

    it('should return null when Glucose is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Triglycerides: 150 },
      };
      expect(calculateTyG(inputs)).toBeNull();
    });

    it('should return null when Triglycerides is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: 100, Triglycerides: 0 },
      };
      expect(calculateTyG(inputs)).toBeNull();
    });

    it('should return null when Glucose is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: 0, Triglycerides: 150 },
      };
      expect(calculateTyG(inputs)).toBeNull();
    });

    it('should return null when Triglycerides is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: 100, Triglycerides: -50 },
      };
      expect(calculateTyG(inputs)).toBeNull();
    });

    it('should return null when Glucose is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: -20, Triglycerides: 150 },
      };
      expect(calculateTyG(inputs)).toBeNull();
    });
  });
});

describe('calculateHOMAIR', () => {
  /**
   * Reference: Matthews DR et al. Diabetologia 1985;28(7):412-419.
   * Formula: (Fasting Glucose x Fasting Insulin) / 405
   * Glucose in mg/dL, Insulin in uU/mL.
   *
   * Example: Glucose=90, Insulin=10
   * = (90 * 10) / 405
   * = 900 / 405
   * = 2.222
   */
  it('should calculate correctly for a known example', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { Glucose: 90, Insulin: 10 },
    };
    const result = calculateHOMAIR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(2.222, 2);
  });

  it('should return normal value for insulin-sensitive individual', () => {
    // Glucose=85, Insulin=5 => (85*5)/405 = 1.049
    const inputs: CalculatorInputs = {
      biomarkers: { Glucose: 85, Insulin: 5 },
    };
    const result = calculateHOMAIR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(1.049, 2);
    expect(result!).toBeLessThan(2.71); // Brazilian cutoff (Geloneze 2006)
  });

  it('should return elevated value for insulin-resistant individual', () => {
    // Glucose=110, Insulin=20 => (110*20)/405 = 5.432
    const inputs: CalculatorInputs = {
      biomarkers: { Glucose: 110, Insulin: 20 },
    };
    const result = calculateHOMAIR(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(5.432, 2);
    expect(result!).toBeGreaterThan(2.71); // Above Brazilian cutoff
  });

  describe('boundary: Brazilian cutoff at 2.71', () => {
    it('should produce value near the 2.71 cutoff', () => {
      // Want (Glucose * Insulin) / 405 = 2.71
      // Glucose * Insulin = 2.71 * 405 = 1097.55
      // Glucose=90, Insulin=12.195 => (90*12.195)/405 = 2.71
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: 90, Insulin: 12.195 },
      };
      const result = calculateHOMAIR(inputs);
      expect(result).not.toBeNull();
      expect(result!).toBeCloseTo(2.71, 1);
    });
  });

  describe('edge cases', () => {
    it('should return null when Glucose is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Insulin: 10 },
      };
      expect(calculateHOMAIR(inputs)).toBeNull();
    });

    it('should return null when Insulin is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: 90 },
      };
      expect(calculateHOMAIR(inputs)).toBeNull();
    });

    it('should return null when Glucose is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: 0, Insulin: 10 },
      };
      expect(calculateHOMAIR(inputs)).toBeNull();
    });

    it('should return null when Insulin is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: 90, Insulin: 0 },
      };
      expect(calculateHOMAIR(inputs)).toBeNull();
    });

    it('should return null when Glucose is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: -10, Insulin: 10 },
      };
      expect(calculateHOMAIR(inputs)).toBeNull();
    });

    it('should return null when Insulin is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Glucose: 90, Insulin: -5 },
      };
      expect(calculateHOMAIR(inputs)).toBeNull();
    });
  });
});
