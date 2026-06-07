import type { CalculatorInputs } from '../types';

/**
 * Atherogenic Index of Plasma (AIP).
 * Dobiášová M, Frohlich J. Clinical Biochemistry 2001;34(7):583–588.
 *
 * Formula: log10(TG / HDL-C), both in mmol/L.
 * Conversion from mg/dL: TG ÷ 88.57, HDL ÷ 38.67.
 */
export const calculateAIP = (inputs: CalculatorInputs): number | null => {
  const { biomarkers } = inputs;
  const tg = biomarkers.Triglycerides;
  const hdl = biomarkers.HDL;

  if (tg == null || hdl == null) return null;
  if (hdl <= 0 || tg <= 0) return null;

  const tgMmol = tg / 88.57;
  const hdlMmol = hdl / 38.67;

  return Math.log10(tgMmol / hdlMmol);
};

/**
 * Castelli Risk Index I — Total Cholesterol / HDL-C.
 * Castelli WP et al. Circulation 1983;67(4):730–734.
 */
export const calculateCastelliI = (inputs: CalculatorInputs): number | null => {
  const { biomarkers } = inputs;
  const cholesterol = biomarkers.Cholesterol;
  const hdl = biomarkers.HDL;

  if (cholesterol == null || hdl == null) return null;
  if (hdl <= 0) return null;

  return cholesterol / hdl;
};

/**
 * Castelli Risk Index II — LDL-C / HDL-C.
 * Castelli WP et al. Circulation 1983;67(4):730–734.
 */
export const calculateCastelliII = (inputs: CalculatorInputs): number | null => {
  const { biomarkers } = inputs;
  const ldl = biomarkers.LDL;
  const hdl = biomarkers.HDL;

  if (ldl == null || hdl == null) return null;
  if (hdl <= 0) return null;

  return ldl / hdl;
};

// --- ASCVD Pooled Cohort Equations (2013 ACC/AHA) ---
// Goff DC Jr et al. Circulation 2014;129(25 Suppl 2):S49–S73.
// Coefficients from Appendix 7, Table A (White race-sex groups).
// Using "White" coefficients as default for Brazilian population (per SBC guidelines).
// Verified against Cerner SMART ASCVD Risk Calculator (github.com/cerner/ascvd-risk-calculator).

interface ASCVDCoefficients {
  currentSmoker: number;
  diabetes: number;
  lnAge: number;
  lnAge_currentSmoker: number;
  lnAge_lnHDL: number;
  lnAge_lnTC: number;
  lnAgeSq: number;
  lnHDL: number;
  lnTC: number;
  lnTreatedSBP: number;
  lnUntreatedSBP: number;
  meanCoeffValue: number;
  s010: number;
}

const WHITE_FEMALE_COEFFICIENTS: ASCVDCoefficients = {
  currentSmoker: 7.574,
  diabetes: 0.661,
  lnAge: -29.799,
  lnAge_currentSmoker: -1.665,
  lnAge_lnHDL: 3.149,
  lnAge_lnTC: -3.114,
  lnAgeSq: 4.884,
  lnHDL: -13.578,
  lnTC: 13.54,
  lnTreatedSBP: 2.019,
  lnUntreatedSBP: 1.957,
  meanCoeffValue: -29.1817,
  s010: 0.96652,
};

const WHITE_MALE_COEFFICIENTS: ASCVDCoefficients = {
  currentSmoker: 7.837,
  diabetes: 0.658,
  lnAge: 12.344,
  lnAge_currentSmoker: -1.795,
  lnAge_lnHDL: 1.769,
  lnAge_lnTC: -2.664,
  lnAgeSq: 0,
  lnHDL: -7.99,
  lnTC: 11.853,
  lnTreatedSBP: 1.797,
  lnUntreatedSBP: 1.764,
  meanCoeffValue: 61.1816,
  s010: 0.91436,
};

/**
 * ASCVD 10-Year Risk Score (Pooled Cohort Equations).
 * Valid for ages 40–79.
 */
export const calculateASCVD = (inputs: CalculatorInputs): number | null => {
  const { age, biomarkers, sex, userInputs } = inputs;
  const totalCholesterol = biomarkers.Cholesterol;
  const hdl = biomarkers.HDL;
  const systolicBP = userInputs?.systolicBP as number | undefined;
  const bpTreatment = userInputs?.bpTreatment as boolean | undefined;
  const smoking = userInputs?.smoking as boolean | undefined;
  const diabetes = userInputs?.diabetes as boolean | undefined;

  if (
    age == null ||
    sex == null ||
    totalCholesterol == null ||
    hdl == null ||
    systolicBP == null ||
    bpTreatment == null ||
    smoking == null ||
    diabetes == null
  )
    return null;

  if (age < 40 || age > 79) return null;
  if (hdl <= 0 || totalCholesterol <= 0 || systolicBP <= 0) return null;

  const c = sex === 'F' ? WHITE_FEMALE_COEFFICIENTS : WHITE_MALE_COEFFICIENTS;

  const lnAge = Math.log(age);
  const lnTC = Math.log(totalCholesterol);
  const lnHDL = Math.log(hdl);
  const lnSBP = Math.log(systolicBP);

  let sum = 0;
  sum += c.lnAge * lnAge;
  sum += c.lnAgeSq * lnAge * lnAge;
  sum += c.lnTC * lnTC;
  sum += c.lnAge_lnTC * lnAge * lnTC;
  sum += c.lnHDL * lnHDL;
  sum += c.lnAge_lnHDL * lnAge * lnHDL;

  if (bpTreatment) {
    sum += c.lnTreatedSBP * lnSBP;
  } else {
    sum += c.lnUntreatedSBP * lnSBP;
  }

  if (smoking) {
    sum += c.currentSmoker;
    sum += c.lnAge_currentSmoker * lnAge;
  }

  if (diabetes) {
    sum += c.diabetes;
  }

  const risk = 1 - Math.pow(c.s010, Math.exp(sum - c.meanCoeffValue));
  return Math.max(0, Math.min(1, risk)) * 100;
};
