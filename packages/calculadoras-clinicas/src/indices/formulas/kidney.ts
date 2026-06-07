import type { CalculatorInputs } from '../types';

/**
 * eGFR — CKD-EPI 2021 (race-free) equation.
 * Inker LA et al. NEJM 2021;385(19):1737–1749.
 *
 * For females (κ = 0.7):
 *   If Scr/κ ≤ 1: eGFR = 142 × (Scr/0.7)^(-0.241) × 0.9938^Age × 1.012
 *   If Scr/κ > 1: eGFR = 142 × (Scr/0.7)^(-1.200) × 0.9938^Age × 1.012
 *
 * For males (κ = 0.9):
 *   If Scr/κ ≤ 1: eGFR = 142 × (Scr/0.9)^(-0.302) × 0.9938^Age
 *   If Scr/κ > 1: eGFR = 142 × (Scr/0.9)^(-1.200) × 0.9938^Age
 *
 * Scr = serum creatinine in mg/dL.
 */
export const calculateEGFR = (inputs: CalculatorInputs): number | null => {
  const { age, biomarkers, sex } = inputs;
  const creatinine = biomarkers.Creatinine;

  if (age == null || sex == null || creatinine == null) return null;
  if (creatinine <= 0) return null;

  const isFemale = sex === 'F';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const sexMultiplier = isFemale ? 1.012 : 1.0;

  const scrOverKappa = creatinine / kappa;
  const exponent = scrOverKappa <= 1 ? alpha : -1.2;

  return 142 * Math.pow(scrOverKappa, exponent) * Math.pow(0.9938, age) * sexMultiplier;
};
