import type { CalculatorInputs } from '../types';

/**
 * Systemic Immune-Inflammation Index (SII).
 * Hu B et al. Clinical Cancer Research 2014;20(23):6212–6222.
 *
 * Formula: (Platelet count × Neutrophil count) / Lymphocyte count
 * All values in ×10⁹/L (absolute counts).
 */
export const calculateSII = (inputs: CalculatorInputs): number | null => {
  const { biomarkers } = inputs;
  const platelets = biomarkers.Platelets;
  const neutrophils = biomarkers.Neutrophils_Abs;
  const lymphocytes = biomarkers.Lymphocytes_Abs;

  if (platelets == null || neutrophils == null || lymphocytes == null) return null;
  if (lymphocytes <= 0) return null;

  return (platelets * neutrophils) / lymphocytes;
};

/**
 * Neutrophil-to-Lymphocyte Ratio (NLR).
 * Forget P et al. BMC Research Notes 2017;10:12.
 *
 * Formula: Neutrophil count / Lymphocyte count
 * Both in ×10⁹/L (absolute counts).
 */
export const calculateNLR = (inputs: CalculatorInputs): number | null => {
  const { biomarkers } = inputs;
  const neutrophils = biomarkers.Neutrophils_Abs;
  const lymphocytes = biomarkers.Lymphocytes_Abs;

  if (neutrophils == null || lymphocytes == null) return null;
  if (lymphocytes <= 0) return null;

  return neutrophils / lymphocytes;
};
