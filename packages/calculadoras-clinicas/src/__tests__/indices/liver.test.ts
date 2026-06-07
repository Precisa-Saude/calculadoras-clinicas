import { describe, expect, it } from 'vitest';

import { calculateAPRI, calculateFIB4, calculateFLI } from '../../indices/formulas/liver';
import type { CalculatorInputs } from '../../indices/types';

describe('calculateFIB4', () => {
  /**
   * Reference: Sterling RK et al. Hepatology 2006;43(6):1317-1325.
   * Formula: (Age x AST) / (Platelets x sqrt(ALT))
   *
   * Example: 50yo, AST=40, ALT=35, Platelets=200
   * = (50 * 40) / (200 * sqrt(35))
   * = 2000 / (200 * 5.9161)
   * = 2000 / 1183.22
   * = 1.690
   */
  it('should calculate correctly for a known example', () => {
    const inputs: CalculatorInputs = {
      age: 50,
      biomarkers: { ALT: 35, AST: 40, Platelets: 200 },
    };
    const result = calculateFIB4(inputs);
    expect(result).toBeCloseTo(1.69, 2);
  });

  it('should return low-risk value for young patient with normal labs', () => {
    const inputs: CalculatorInputs = {
      age: 30,
      biomarkers: { ALT: 25, AST: 20, Platelets: 250 },
    };
    const result = calculateFIB4(inputs);
    expect(result).not.toBeNull();
    // (30 * 20) / (250 * sqrt(25)) = 600 / 1250 = 0.48
    expect(result!).toBeCloseTo(0.48, 2);
    expect(result!).toBeLessThan(1.3); // Low risk threshold
  });

  it('should return high-risk value for older patient with elevated enzymes', () => {
    const inputs: CalculatorInputs = {
      age: 65,
      biomarkers: { ALT: 30, AST: 80, Platelets: 100 },
    };
    const result = calculateFIB4(inputs);
    expect(result).not.toBeNull();
    // (65 * 80) / (100 * sqrt(30)) = 5200 / 547.72 = 9.49
    expect(result!).toBeGreaterThan(3.25); // High risk threshold
  });

  describe('boundary: risk zone thresholds', () => {
    it('should produce value near the 1.3 low-risk cutoff', () => {
      // Targeting FIB-4 ~ 1.3: (45 * 30) / (250 * sqrt(20)) = 1350 / 1118.03 = 1.208
      const inputs: CalculatorInputs = {
        age: 45,
        biomarkers: { ALT: 20, AST: 30, Platelets: 250 },
      };
      const result = calculateFIB4(inputs);
      expect(result).not.toBeNull();
      expect(result!).toBeCloseTo(1.208, 2);
    });
  });

  describe('edge cases', () => {
    it('should return null when age is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { ALT: 35, AST: 40, Platelets: 200 },
      };
      expect(calculateFIB4(inputs)).toBeNull();
    });

    it('should return null when AST is missing', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: { ALT: 35, Platelets: 200 },
      };
      expect(calculateFIB4(inputs)).toBeNull();
    });

    it('should return null when ALT is missing', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: { AST: 40, Platelets: 200 },
      };
      expect(calculateFIB4(inputs)).toBeNull();
    });

    it('should return null when Platelets is missing', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: { ALT: 35, AST: 40 },
      };
      expect(calculateFIB4(inputs)).toBeNull();
    });

    it('should return null when ALT is zero', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: { ALT: 0, AST: 40, Platelets: 200 },
      };
      expect(calculateFIB4(inputs)).toBeNull();
    });

    it('should return null when ALT is negative', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: { ALT: -5, AST: 40, Platelets: 200 },
      };
      expect(calculateFIB4(inputs)).toBeNull();
    });

    it('should return null when Platelets is zero', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: { ALT: 35, AST: 40, Platelets: 0 },
      };
      expect(calculateFIB4(inputs)).toBeNull();
    });

    it('should return null when Platelets is negative', () => {
      const inputs: CalculatorInputs = {
        age: 50,
        biomarkers: { ALT: 35, AST: 40, Platelets: -100 },
      };
      expect(calculateFIB4(inputs)).toBeNull();
    });
  });
});

describe('calculateAPRI', () => {
  /**
   * Reference: Wai CT et al. Hepatology 2003;38(2):518-526.
   * Formula: ((AST / AST_ULN) x 100) / Platelets
   * AST_ULN = 40 U/L
   *
   * Example: AST=60, Platelets=150
   * = ((60/40) * 100) / 150
   * = 150 / 150
   * = 1.0
   */
  it('should calculate correctly for a known example', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { AST: 60, Platelets: 150 },
    };
    const result = calculateAPRI(inputs);
    expect(result).toBeCloseTo(1.0, 2);
  });

  it('should return low value for normal AST and high platelets', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { AST: 25, Platelets: 250 },
    };
    const result = calculateAPRI(inputs);
    // ((25/40) * 100) / 250 = 62.5 / 250 = 0.25
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(0.25, 2);
    expect(result!).toBeLessThan(0.5); // Low risk
  });

  it('should return high value suggesting significant fibrosis', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { AST: 120, Platelets: 80 },
    };
    const result = calculateAPRI(inputs);
    // ((120/40) * 100) / 80 = 300 / 80 = 3.75
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(3.75, 2);
    expect(result!).toBeGreaterThan(1.5); // High risk
  });

  describe('edge cases', () => {
    it('should return null when AST is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Platelets: 200 },
      };
      expect(calculateAPRI(inputs)).toBeNull();
    });

    it('should return null when Platelets is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { AST: 40 },
      };
      expect(calculateAPRI(inputs)).toBeNull();
    });

    it('should return null when Platelets is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { AST: 40, Platelets: 0 },
      };
      expect(calculateAPRI(inputs)).toBeNull();
    });

    it('should return null when Platelets is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { AST: 40, Platelets: -50 },
      };
      expect(calculateAPRI(inputs)).toBeNull();
    });

    it('should handle AST of zero (produces zero result)', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { AST: 0, Platelets: 200 },
      };
      const result = calculateAPRI(inputs);
      expect(result).toBe(0);
    });
  });
});

describe('calculateFLI', () => {
  /**
   * Reference: Bedogni G et al. BMC Gastroenterology 2006;6:33.
   * Formula: (e^y / (1 + e^y)) x 100
   * y = 0.953*ln(TG) + 0.139*BMI + 0.718*ln(GGT) + 0.053*Waist - 15.745
   *
   * Example: TG=150, GGT=45, BMI=28, Waist=95
   * y = 0.953*ln(150) + 0.139*28 + 0.718*ln(45) + 0.053*95 - 15.745
   * y = 0.953*5.0106 + 3.892 + 0.718*3.8067 + 5.035 - 15.745
   * y = 4.775 + 3.892 + 2.733 + 5.035 - 15.745
   * y = 0.690
   * FLI = (e^0.690 / (1 + e^0.690)) * 100
   * FLI = (1.9937 / 2.9937) * 100 = 66.6
   */
  it('should calculate correctly for a known example', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { GGT: 45, Triglycerides: 150 },
      bmi: 28,
      userInputs: { waist: 95 },
    };
    const result = calculateFLI(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(66.6, 0);
  });

  it('should return low FLI for lean patient with normal labs', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { GGT: 15, Triglycerides: 60 },
      bmi: 21,
      userInputs: { waist: 70 },
    };
    const result = calculateFLI(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeLessThan(30); // Low risk: FLI < 30
  });

  it('should return high FLI for obese patient with elevated labs', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { GGT: 120, Triglycerides: 300 },
      bmi: 35,
      userInputs: { waist: 115 },
    };
    const result = calculateFLI(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThan(60); // High risk: FLI >= 60
  });

  it('should always return a value between 0 and 100', () => {
    // Extreme low values
    const lowInputs: CalculatorInputs = {
      biomarkers: { GGT: 5, Triglycerides: 30 },
      bmi: 16,
      userInputs: { waist: 55 },
    };
    const lowResult = calculateFLI(lowInputs);
    expect(lowResult).not.toBeNull();
    expect(lowResult!).toBeGreaterThanOrEqual(0);
    expect(lowResult!).toBeLessThanOrEqual(100);

    // Extreme high values
    const highInputs: CalculatorInputs = {
      biomarkers: { GGT: 500, Triglycerides: 1000 },
      bmi: 50,
      userInputs: { waist: 150 },
    };
    const highResult = calculateFLI(highInputs);
    expect(highResult).not.toBeNull();
    expect(highResult!).toBeGreaterThanOrEqual(0);
    expect(highResult!).toBeLessThanOrEqual(100);
  });

  describe('edge cases', () => {
    it('should return null when Triglycerides is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { GGT: 45 },
        bmi: 28,
        userInputs: { waist: 95 },
      };
      expect(calculateFLI(inputs)).toBeNull();
    });

    it('should return null when GGT is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Triglycerides: 150 },
        bmi: 28,
        userInputs: { waist: 95 },
      };
      expect(calculateFLI(inputs)).toBeNull();
    });

    it('should return null when BMI is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { GGT: 45, Triglycerides: 150 },
        userInputs: { waist: 95 },
      };
      expect(calculateFLI(inputs)).toBeNull();
    });

    it('should return null when waist is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { GGT: 45, Triglycerides: 150 },
        bmi: 28,
      };
      expect(calculateFLI(inputs)).toBeNull();
    });

    it('should return null when userInputs is undefined', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { GGT: 45, Triglycerides: 150 },
        bmi: 28,
      };
      expect(calculateFLI(inputs)).toBeNull();
    });

    it('should return null when Triglycerides is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { GGT: 45, Triglycerides: 0 },
        bmi: 28,
        userInputs: { waist: 95 },
      };
      expect(calculateFLI(inputs)).toBeNull();
    });

    it('should return null when GGT is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { GGT: 0, Triglycerides: 150 },
        bmi: 28,
        userInputs: { waist: 95 },
      };
      expect(calculateFLI(inputs)).toBeNull();
    });

    it('should return null when Triglycerides is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { GGT: 45, Triglycerides: -10 },
        bmi: 28,
        userInputs: { waist: 95 },
      };
      expect(calculateFLI(inputs)).toBeNull();
    });
  });
});
