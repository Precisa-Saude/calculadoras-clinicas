import { describe, expect, it } from 'vitest';

import {
  calculateAIP,
  calculateASCVD,
  calculateCastelliI,
  calculateCastelliII,
} from '../../indices/formulas/cardiovascular';
import type { CalculatorInputs } from '../../indices/types';

describe('calculateAIP', () => {
  /**
   * Reference: Dobiasova M, Frohlich J. Clinical Biochemistry 2001;34(7):583-588.
   * Formula: log10(TG_mmol / HDL_mmol)
   * TG_mmol = TG_mg/dL / 88.57
   * HDL_mmol = HDL_mg/dL / 38.67
   *
   * Example: TG=150 mg/dL, HDL=50 mg/dL
   * TG_mmol = 150 / 88.57 = 1.6935
   * HDL_mmol = 50 / 38.67 = 1.2930
   * AIP = log10(1.6935 / 1.2930) = log10(1.3098) = 0.1173
   */
  it('should calculate correctly for a known example', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { HDL: 50, Triglycerides: 150 },
    };
    const result = calculateAIP(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(0.117, 2);
  });

  it('should return negative AIP for low-risk profile (high HDL, low TG)', () => {
    // TG=80, HDL=70
    // TG_mmol = 0.9033, HDL_mmol = 1.8105
    // AIP = log10(0.9033 / 1.8105) = log10(0.4989) = -0.302
    const inputs: CalculatorInputs = {
      biomarkers: { HDL: 70, Triglycerides: 80 },
    };
    const result = calculateAIP(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeLessThan(0.11); // Low risk threshold
    expect(result!).toBeCloseTo(-0.302, 2);
  });

  it('should return high AIP for high-risk profile (low HDL, high TG)', () => {
    // TG=300, HDL=30
    // TG_mmol = 3.3876, HDL_mmol = 0.7759
    // AIP = log10(3.3876 / 0.7759) = log10(4.366) = 0.640
    const inputs: CalculatorInputs = {
      biomarkers: { HDL: 30, Triglycerides: 300 },
    };
    const result = calculateAIP(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThan(0.21); // High risk threshold
    expect(result!).toBeCloseTo(0.64, 2);
  });

  it('should return zero when TG/HDL ratio in mmol is 1', () => {
    // Need TG_mmol = HDL_mmol => TG/88.57 = HDL/38.67
    // TG = HDL * (88.57/38.67) = HDL * 2.2903
    // If HDL = 50, TG = 114.52
    const inputs: CalculatorInputs = {
      biomarkers: { HDL: 50, Triglycerides: 50 * (88.57 / 38.67) },
    };
    const result = calculateAIP(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(0, 5);
  });

  describe('edge cases', () => {
    it('should return null when TG is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { HDL: 50 },
      };
      expect(calculateAIP(inputs)).toBeNull();
    });

    it('should return null when HDL is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Triglycerides: 150 },
      };
      expect(calculateAIP(inputs)).toBeNull();
    });

    it('should return null when HDL is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { HDL: 0, Triglycerides: 150 },
      };
      expect(calculateAIP(inputs)).toBeNull();
    });

    it('should return null when TG is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { HDL: 50, Triglycerides: 0 },
      };
      expect(calculateAIP(inputs)).toBeNull();
    });

    it('should return null when HDL is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { HDL: -10, Triglycerides: 150 },
      };
      expect(calculateAIP(inputs)).toBeNull();
    });

    it('should return null when TG is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { HDL: 50, Triglycerides: -20 },
      };
      expect(calculateAIP(inputs)).toBeNull();
    });
  });
});

describe('calculateCastelliI', () => {
  /**
   * Reference: Castelli WP et al. Circulation 1983;67(4):730-734.
   * Formula: Total Cholesterol / HDL-C
   *
   * Example: TC=220, HDL=55 => 220/55 = 4.0
   */
  it('should calculate correctly for a known example', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { Cholesterol: 220, HDL: 55 },
    };
    const result = calculateCastelliI(inputs);
    expect(result).toBeCloseTo(4.0, 2);
  });

  it('should return desirable ratio for healthy lipid profile', () => {
    // TC=180, HDL=60 => 3.0 (desirable < 4.4 for men, < 4.0 for women)
    const inputs: CalculatorInputs = {
      biomarkers: { Cholesterol: 180, HDL: 60 },
    };
    const result = calculateCastelliI(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(3.0, 2);
  });

  it('should return elevated ratio for high TC / low HDL', () => {
    // TC=280, HDL=35 => 8.0
    const inputs: CalculatorInputs = {
      biomarkers: { Cholesterol: 280, HDL: 35 },
    };
    const result = calculateCastelliI(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(8.0, 2);
  });

  describe('edge cases', () => {
    it('should return null when Cholesterol is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { HDL: 55 },
      };
      expect(calculateCastelliI(inputs)).toBeNull();
    });

    it('should return null when HDL is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Cholesterol: 220 },
      };
      expect(calculateCastelliI(inputs)).toBeNull();
    });

    it('should return null when HDL is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Cholesterol: 220, HDL: 0 },
      };
      expect(calculateCastelliI(inputs)).toBeNull();
    });

    it('should return null when HDL is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { Cholesterol: 220, HDL: -10 },
      };
      expect(calculateCastelliI(inputs)).toBeNull();
    });
  });
});

describe('calculateCastelliII', () => {
  /**
   * Reference: Castelli WP et al. Circulation 1983;67(4):730-734.
   * Formula: LDL-C / HDL-C
   *
   * Example: LDL=130, HDL=50 => 130/50 = 2.6
   */
  it('should calculate correctly for a known example', () => {
    const inputs: CalculatorInputs = {
      biomarkers: { HDL: 50, LDL: 130 },
    };
    const result = calculateCastelliII(inputs);
    expect(result).toBeCloseTo(2.6, 2);
  });

  it('should return desirable ratio for optimal LDL/HDL', () => {
    // LDL=90, HDL=65 => 1.385
    const inputs: CalculatorInputs = {
      biomarkers: { HDL: 65, LDL: 90 },
    };
    const result = calculateCastelliII(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(1.385, 2);
    expect(result!).toBeLessThan(2.0); // Desirable
  });

  it('should return elevated ratio for high LDL / low HDL', () => {
    // LDL=190, HDL=35 => 5.43
    const inputs: CalculatorInputs = {
      biomarkers: { HDL: 35, LDL: 190 },
    };
    const result = calculateCastelliII(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(5.43, 1);
  });

  describe('edge cases', () => {
    it('should return null when LDL is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { HDL: 50 },
      };
      expect(calculateCastelliII(inputs)).toBeNull();
    });

    it('should return null when HDL is missing', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { LDL: 130 },
      };
      expect(calculateCastelliII(inputs)).toBeNull();
    });

    it('should return null when HDL is zero', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { HDL: 0, LDL: 130 },
      };
      expect(calculateCastelliII(inputs)).toBeNull();
    });

    it('should return null when HDL is negative', () => {
      const inputs: CalculatorInputs = {
        biomarkers: { HDL: -10, LDL: 130 },
      };
      expect(calculateCastelliII(inputs)).toBeNull();
    });
  });
});

describe('calculateASCVD', () => {
  /**
   * Reference: Goff DC Jr et al. Circulation 2014;129(25 Suppl 2):S49-S73.
   * Published example — White female, age 55, TC=213, HDL=50,
   * untreated SBP=120, non-smoker, non-diabetic => ~2.1%
   */
  it('should match the paper example for white female (~2.1%)', () => {
    const inputs: CalculatorInputs = {
      age: 55,
      biomarkers: { Cholesterol: 213, HDL: 50 },
      sex: 'F',
      userInputs: { bpTreatment: false, diabetes: false, smoking: false, systolicBP: 120 },
    };
    const result = calculateASCVD(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(2.1, 0);
  });

  /**
   * Published example — White male, age 55, TC=213, HDL=50,
   * untreated SBP=120, non-smoker, non-diabetic => ~5.3%
   */
  it('should match the paper example for white male (~5.3%)', () => {
    const inputs: CalculatorInputs = {
      age: 55,
      biomarkers: { Cholesterol: 213, HDL: 50 },
      sex: 'M',
      userInputs: { bpTreatment: false, diabetes: false, smoking: false, systolicBP: 120 },
    };
    const result = calculateASCVD(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(5.3, 0);
  });

  it('should increase risk with smoking', () => {
    const base: CalculatorInputs = {
      age: 55,
      biomarkers: { Cholesterol: 213, HDL: 50 },
      sex: 'M',
      userInputs: { bpTreatment: false, diabetes: false, smoking: false, systolicBP: 120 },
    };
    const smoker: CalculatorInputs = {
      ...base,
      userInputs: { bpTreatment: false, diabetes: false, smoking: true, systolicBP: 120 },
    };
    expect(calculateASCVD(smoker)!).toBeGreaterThan(calculateASCVD(base)!);
  });

  it('should increase risk with diabetes', () => {
    const base: CalculatorInputs = {
      age: 55,
      biomarkers: { Cholesterol: 213, HDL: 50 },
      sex: 'F',
      userInputs: { bpTreatment: false, diabetes: false, smoking: false, systolicBP: 120 },
    };
    const diabetic: CalculatorInputs = {
      ...base,
      userInputs: { bpTreatment: false, diabetes: true, smoking: false, systolicBP: 120 },
    };
    expect(calculateASCVD(diabetic)!).toBeGreaterThan(calculateASCVD(base)!);
  });

  it('should return null for age below 40', () => {
    const inputs: CalculatorInputs = {
      age: 35,
      biomarkers: { Cholesterol: 200, HDL: 50 },
      sex: 'M',
      userInputs: { bpTreatment: false, diabetes: false, smoking: false, systolicBP: 120 },
    };
    expect(calculateASCVD(inputs)).toBeNull();
  });

  it('should return null for age above 79', () => {
    const inputs: CalculatorInputs = {
      age: 85,
      biomarkers: { Cholesterol: 200, HDL: 50 },
      sex: 'M',
      userInputs: { bpTreatment: false, diabetes: false, smoking: false, systolicBP: 120 },
    };
    expect(calculateASCVD(inputs)).toBeNull();
  });

  it('should return null when required inputs are missing', () => {
    expect(calculateASCVD({ biomarkers: { Cholesterol: 200, HDL: 50 } })).toBeNull();
    expect(
      calculateASCVD({
        age: 55,
        biomarkers: { Cholesterol: 200, HDL: 50 },
        sex: 'M',
      }),
    ).toBeNull();
  });

  it('should return value between 0 and 100', () => {
    const inputs: CalculatorInputs = {
      age: 79,
      biomarkers: { Cholesterol: 300, HDL: 30 },
      sex: 'M',
      userInputs: { bpTreatment: true, diabetes: true, smoking: true, systolicBP: 200 },
    };
    const result = calculateASCVD(inputs);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThanOrEqual(0);
    expect(result!).toBeLessThanOrEqual(100);
  });
});
