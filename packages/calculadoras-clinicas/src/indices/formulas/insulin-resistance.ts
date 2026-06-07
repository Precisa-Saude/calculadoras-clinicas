import type { CalculatorInputs } from '../types';

/**
 * TyG Index — Triglyceride-Glucose Index for insulin resistance.
 * Simental-Mendía LE et al. Metabolic Syndrome and Related Disorders 2008;6(4):299–304.
 *
 * Formula: ln(Fasting TG × Fasting Glucose / 2)
 * Both values in mg/dL. ln = natural logarithm.
 */
export const calculateTyG = (inputs: CalculatorInputs): number | null => {
  const { biomarkers } = inputs;
  const tg = biomarkers.Triglycerides;
  const glucose = biomarkers.Glucose;

  if (tg == null || glucose == null) return null;
  if (tg <= 0 || glucose <= 0) return null;

  return Math.log((tg * glucose) / 2);
};

/**
 * HOMA-IR — Homeostatic Model Assessment for Insulin Resistance.
 * Matthews DR et al. Diabetologia 1985;28(7):412–419.
 *
 * Formula: (Fasting Glucose × Fasting Insulin) / 405
 * Glucose in mg/dL, Insulin in µU/mL.
 *
 * Brazilian cutoff: ≥ 2.71 (Geloneze et al. 2006).
 */
export const calculateHOMAIR = (inputs: CalculatorInputs): number | null => {
  const { biomarkers } = inputs;
  const glucose = biomarkers.Glucose;
  const insulin = biomarkers.Insulin;

  if (glucose == null || insulin == null) return null;
  if (glucose <= 0 || insulin <= 0) return null;

  return (glucose * insulin) / 405;
};
