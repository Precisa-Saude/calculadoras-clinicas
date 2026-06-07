import type { CalculatorInputs } from '../types';

/**
 * FIB-4 Index — non-invasive liver fibrosis screening.
 * Sterling RK et al. Hepatology 2006;43(6):1317–1325.
 *
 * Formula: (Age × AST) / (Platelet count × √ALT)
 * Platelets in 10⁹/L, AST and ALT in U/L.
 */
export const calculateFIB4 = (inputs: CalculatorInputs): number | null => {
  const { age, biomarkers } = inputs;
  const ast = biomarkers.AST;
  const alt = biomarkers.ALT;
  const platelets = biomarkers.Platelets;

  if (age == null || ast == null || alt == null || platelets == null) return null;
  if (alt <= 0 || platelets <= 0) return null;

  return (age * ast) / (platelets * Math.sqrt(alt));
};

/**
 * APRI — AST to Platelet Ratio Index.
 * Wai CT et al. Hepatology 2003;38(2):518–526.
 *
 * Formula: ((AST / AST_ULN) × 100) / Platelet count
 * Default AST ULN = 40 U/L. Platelets in 10⁹/L.
 */
export const calculateAPRI = (inputs: CalculatorInputs): number | null => {
  const { biomarkers } = inputs;
  const ast = biomarkers.AST;
  const platelets = biomarkers.Platelets;

  if (ast == null || platelets == null) return null;
  if (platelets <= 0) return null;

  const astULN = 40;
  return ((ast / astULN) * 100) / platelets;
};

/**
 * Fatty Liver Index (FLI) — predicts hepatic steatosis.
 * Bedogni G et al. BMC Gastroenterology 2006;6:33.
 *
 * Formula: (e^y / (1 + e^y)) × 100
 * y = 0.953×ln(TG) + 0.139×BMI + 0.718×ln(GGT) + 0.053×Waist − 15.745
 * TG in mg/dL, GGT in U/L, BMI in kg/m², Waist in cm.
 */
export const calculateFLI = (inputs: CalculatorInputs): number | null => {
  const { biomarkers, bmi, userInputs } = inputs;
  const tg = biomarkers.Triglycerides;
  const ggt = biomarkers.GGT;
  const waist = userInputs?.waist as number | undefined;

  if (tg == null || ggt == null || bmi == null || waist == null) return null;
  if (tg <= 0 || ggt <= 0) return null;

  const y = 0.953 * Math.log(tg) + 0.139 * bmi + 0.718 * Math.log(ggt) + 0.053 * waist - 15.745;
  return (Math.exp(y) / (1 + Math.exp(y))) * 100;
};
