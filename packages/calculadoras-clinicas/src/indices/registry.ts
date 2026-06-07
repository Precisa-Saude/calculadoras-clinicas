import { DETAILS } from './details';
import {
  calculateAIP,
  calculateASCVD,
  calculateCastelliI,
  calculateCastelliII,
} from './formulas/cardiovascular';
import { calculateNLR, calculateSII } from './formulas/inflammation';
import { calculateHOMAIR, calculateTyG } from './formulas/insulin-resistance';
import { calculateEGFR } from './formulas/kidney';
import { calculateAPRI, calculateFIB4, calculateFLI } from './formulas/liver';
import { RECOMMENDATIONS } from './recommendations';
import { REFERENCES } from './references';
import type { CalculatorDefinition, RiskZone } from './types';

// --- Liver Health ---

const fib4: CalculatorDefinition = {
  biomarkerDirections: { ALT: 1, AST: 1, Platelets: -1 },
  calculate: calculateFIB4,
  description: 'Triagem não invasiva de fibrose hepática avançada',
  detail: DETAILS['fib4']!,
  domain: 'liver',
  formatValue: (v) => v.toFixed(2),
  formula: '(Idade × AST) / (Plaquetas × √ALT)',
  id: 'fib4',
  name: 'FIB-4',
  recommendations: RECOMMENDATIONS['fib4']!,
  references: REFERENCES['fib4']!,
  requiredBiomarkers: ['AST', 'ALT', 'Platelets'],
  requiredProfile: ['age'],
  riskZones: [
    { color: 'emerald', label: 'Baixo', level: 'low', max: 1.3, min: 0 },
    { color: 'amber', label: 'Indeterminado', level: 'moderate', max: 2.67, min: 1.3 },
    { color: 'red', label: 'Alto', level: 'high', max: 6, min: 2.67 },
  ],
};

const apri: CalculatorDefinition = {
  biomarkerDirections: { AST: 1, Platelets: -1 },
  calculate: calculateAPRI,
  description: 'Índice de AST/plaquetas para avaliação de fibrose',
  detail: DETAILS['apri']!,
  domain: 'liver',
  formatValue: (v) => v.toFixed(2),
  formula: '((AST / ULN) × 100) / Plaquetas',
  id: 'apri',
  name: 'APRI',
  recommendations: RECOMMENDATIONS['apri']!,
  references: REFERENCES['apri']!,
  requiredBiomarkers: ['AST', 'Platelets'],
  riskZones: [
    { color: 'emerald', label: 'Baixa', level: 'low', max: 0.5, min: 0 },
    { color: 'amber', label: 'Indeterminado', level: 'moderate', max: 1.5, min: 0.5 },
    { color: 'orange', label: 'Alta', level: 'high', max: 2.0, min: 1.5 },
    { color: 'red', label: 'Cirrose', level: 'very-high', max: 5, min: 2.0 },
  ],
};

const fli: CalculatorDefinition = {
  biomarkerDirections: { GGT: 1, Triglycerides: 1 },
  calculate: calculateFLI,
  description: 'Predição de esteatose hepática (fígado gorduroso)',
  detail: DETAILS['fli']!,
  domain: 'liver',
  formatValue: (v) => Math.round(v).toString(),
  formula: '(e^y / (1 + e^y)) × 100',
  id: 'fli',
  name: 'Índice de Gordura Hepática',
  recommendations: RECOMMENDATIONS['fli']!,
  references: REFERENCES['fli']!,
  requiredBiomarkers: ['Triglycerides', 'GGT'],
  requiredProfile: ['bmi'],
  riskZones: [
    { color: 'emerald', label: 'Descarta', level: 'low', max: 30, min: 0 },
    { color: 'amber', label: 'Indeterminado', level: 'moderate', max: 60, min: 30 },
    { color: 'red', label: 'Indica', level: 'high', max: 100, min: 60 },
  ],
  userInputFields: [
    {
      key: 'waist',
      label: 'Circunferência abdominal',
      max: 200,
      min: 40,
      placeholder: 'Ex: 85',
      type: 'number',
      unit: 'cm',
    },
  ],
};

// --- Cardiovascular Risk ---

const aip: CalculatorDefinition = {
  biomarkerDirections: { HDL: -1, Triglycerides: 1 },
  calculate: calculateAIP,
  description: 'Marcador de partículas LDL pequenas e densas',
  detail: DETAILS['aip']!,
  domain: 'cardiovascular',
  formatValue: (v) => v.toFixed(2),
  formula: 'log₁₀(TG / HDL-C)',
  id: 'aip',
  name: 'Índice Aterogênico',
  recommendations: RECOMMENDATIONS['aip']!,
  references: REFERENCES['aip']!,
  requiredBiomarkers: ['Triglycerides', 'HDL'],
  riskZones: [
    { color: 'emerald', label: 'Baixo', level: 'low', max: 0.11, min: -0.5 },
    { color: 'amber', label: 'Intermediário', level: 'moderate', max: 0.21, min: 0.11 },
    { color: 'red', label: 'Alto', level: 'high', max: 1.0, min: 0.21 },
  ],
};

const CASTELLI_I_MALE: RiskZone[] = [
  { color: 'emerald', label: 'Baixo', level: 'low', max: 3.5, min: 0 },
  { color: 'amber', label: 'Moderado', level: 'moderate', max: 5.0, min: 3.5 },
  { color: 'red', label: 'Alto', level: 'high', max: 10, min: 5.0 },
];

const CASTELLI_I_FEMALE: RiskZone[] = [
  { color: 'emerald', label: 'Baixo', level: 'low', max: 3.0, min: 0 },
  { color: 'amber', label: 'Moderado', level: 'moderate', max: 4.5, min: 3.0 },
  { color: 'red', label: 'Alto', level: 'high', max: 10, min: 4.5 },
];

const castelliI: CalculatorDefinition = {
  biomarkerDirections: { Cholesterol: 1, HDL: -1 },
  calculate: calculateCastelliI,
  description: 'Razão colesterol total / HDL (Framingham)',
  detail: DETAILS['castelli-i']!,
  domain: 'cardiovascular',
  formatValue: (v) => v.toFixed(1),
  formula: 'Colesterol Total / HDL-C',
  getRiskZones: (sex) => (sex === 'F' ? CASTELLI_I_FEMALE : CASTELLI_I_MALE),
  id: 'castelli-i',
  name: 'Castelli I',
  recommendations: RECOMMENDATIONS['castelli-i']!,
  references: REFERENCES['castelli-i']!,
  requiredBiomarkers: ['Cholesterol', 'HDL'],
  requiredProfile: ['sex'],
  riskZones: CASTELLI_I_MALE,
};

const CASTELLI_II_MALE: RiskZone[] = [
  { color: 'emerald', label: 'Baixo', level: 'low', max: 2.5, min: 0 },
  { color: 'amber', label: 'Moderado', level: 'moderate', max: 3.5, min: 2.5 },
  { color: 'red', label: 'Alto', level: 'high', max: 8, min: 3.5 },
];

const CASTELLI_II_FEMALE: RiskZone[] = [
  { color: 'emerald', label: 'Baixo', level: 'low', max: 2.0, min: 0 },
  { color: 'amber', label: 'Moderado', level: 'moderate', max: 3.0, min: 2.0 },
  { color: 'red', label: 'Alto', level: 'high', max: 8, min: 3.0 },
];

const castelliII: CalculatorDefinition = {
  biomarkerDirections: { HDL: -1, LDL: 1 },
  calculate: calculateCastelliII,
  description: 'Razão LDL / HDL (Framingham)',
  detail: DETAILS['castelli-ii']!,
  domain: 'cardiovascular',
  formatValue: (v) => v.toFixed(1),
  formula: 'LDL-C / HDL-C',
  getRiskZones: (sex) => (sex === 'F' ? CASTELLI_II_FEMALE : CASTELLI_II_MALE),
  id: 'castelli-ii',
  name: 'Castelli II',
  recommendations: RECOMMENDATIONS['castelli-ii']!,
  references: REFERENCES['castelli-ii']!,
  requiredBiomarkers: ['LDL', 'HDL'],
  requiredProfile: ['sex'],
  riskZones: CASTELLI_II_MALE,
};

const ascvd: CalculatorDefinition = {
  biomarkerDirections: { Cholesterol: 1, HDL: -1 },
  calculate: calculateASCVD,
  description: 'Risco cardiovascular em 10 anos (ACC/AHA)',
  detail: DETAILS['ascvd']!,
  domain: 'cardiovascular',
  formatValue: (v) => `${v.toFixed(1)}%`,
  formula: 'Pooled Cohort Equations (ACC/AHA)',
  id: 'ascvd',
  name: 'Risco ASCVD',
  recommendations: RECOMMENDATIONS['ascvd']!,
  references: REFERENCES['ascvd']!,
  requiredBiomarkers: ['Cholesterol', 'HDL'],
  requiredProfile: ['age', 'sex'],
  riskZones: [
    { color: 'emerald', label: 'Baixo', level: 'low', max: 5, min: 0 },
    { color: 'amber', label: 'Limítrofe', level: 'moderate', max: 7.5, min: 5 },
    { color: 'orange', label: 'Intermediário', level: 'high', max: 20, min: 7.5 },
    { color: 'red', label: 'Alto', level: 'very-high', max: 100, min: 20 },
  ],
  userInputFields: [
    {
      key: 'systolicBP',
      label: 'Pressão sistólica (número maior)',
      max: 250,
      min: 70,
      placeholder: 'Ex: 120',
      type: 'number',
      unit: 'mmHg',
    },
    {
      key: 'diastolicBP',
      label: 'Pressão diastólica (número menor)',
      max: 150,
      min: 40,
      placeholder: 'Ex: 80',
      type: 'number',
      unit: 'mmHg',
    },
    { key: 'bpTreatment', label: 'Em tratamento para pressão alta?', type: 'boolean' },
    { key: 'smoking', label: 'Fumante atual?', type: 'boolean' },
    { key: 'diabetes', label: 'Diagnóstico de diabetes?', type: 'boolean' },
  ],
};

// --- Insulin Resistance ---

const tyg: CalculatorDefinition = {
  biomarkerDirections: { Glucose: 1, Triglycerides: 1 },
  calculate: calculateTyG,
  description: 'Marcador de resistência à insulina sem necessidade de insulina',
  detail: DETAILS['tyg']!,
  domain: 'insulin-resistance',
  formatValue: (v) => v.toFixed(2),
  formula: 'ln(TG × Glicose / 2)',
  id: 'tyg',
  name: 'Índice TyG',
  recommendations: RECOMMENDATIONS['tyg']!,
  references: REFERENCES['tyg']!,
  requiredBiomarkers: ['Triglycerides', 'Glucose'],
  riskZones: [
    { color: 'emerald', label: 'Normal', level: 'low', max: 8.0, min: 6 },
    { color: 'amber', label: 'Leve', level: 'moderate', max: 8.5, min: 8.0 },
    { color: 'orange', label: 'Moderada', level: 'high', max: 9.0, min: 8.5 },
    { color: 'red', label: 'Severa', level: 'very-high', max: 12, min: 9.0 },
  ],
};

const homaIr: CalculatorDefinition = {
  biomarkerDirections: { Glucose: 1, Insulin: 1 },
  calculate: calculateHOMAIR,
  description: 'Estimativa de resistência à insulina (requer insulina)',
  detail: DETAILS['homa-ir']!,
  domain: 'insulin-resistance',
  formatValue: (v) => v.toFixed(2),
  formula: '(Glicose × Insulina) / 405',
  id: 'homa-ir',
  name: 'HOMA-IR',
  recommendations: RECOMMENDATIONS['homa-ir']!,
  references: REFERENCES['homa-ir']!,
  requiredBiomarkers: ['Glucose', 'Insulin'],
  riskZones: [
    { color: 'emerald', label: 'Ótimo', level: 'low', max: 1.0, min: 0 },
    { color: 'emerald', label: 'Normal', level: 'low', max: 2.0, min: 1.0 },
    { color: 'amber', label: 'Inicial', level: 'moderate', max: 3.0, min: 2.0 },
    { color: 'red', label: 'Significativa', level: 'high', max: 10, min: 3.0 },
  ],
};

// --- Kidney Function ---

const egfr: CalculatorDefinition = {
  biomarkerDirections: { Creatinine: -1 },
  calculate: calculateEGFR,
  description: 'Estimativa da função renal (CKD-EPI 2021)',
  detail: DETAILS['egfr']!,
  domain: 'kidney',
  formatValue: (v) => Math.round(v).toString(),
  formula: 'CKD-EPI 2021 (sem raça)',
  id: 'egfr',
  name: 'eGFR',
  recommendations: RECOMMENDATIONS['egfr']!,
  references: REFERENCES['egfr']!,
  requiredBiomarkers: ['Creatinine'],
  requiredProfile: ['age', 'sex'],
  riskZones: [
    { color: 'red', label: 'G5', level: 'very-high', max: 15, min: 0 },
    { color: 'red', label: 'G4', level: 'very-high', max: 30, min: 15 },
    { color: 'orange', label: 'G3b', level: 'high', max: 45, min: 30 },
    { color: 'amber', label: 'G3a', level: 'moderate', max: 60, min: 45 },
    { color: 'emerald', label: 'G2', level: 'low', max: 90, min: 60 },
    { color: 'emerald', label: 'G1', level: 'low', max: 200, min: 90 },
  ],
};

// --- Inflammation ---

const sii: CalculatorDefinition = {
  biomarkerDirections: { Lymphocytes_Abs: -1, Neutrophils_Abs: 1, Platelets: 1 },
  calculate: calculateSII,
  description: 'Índice composto de inflamação sistêmica',
  detail: DETAILS['sii']!,
  domain: 'inflammation',
  formatValue: (v) => Math.round(v).toString(),
  formula: '(Plaquetas × Neutrófilos) / Linfócitos',
  id: 'sii',
  name: 'SII',
  recommendations: RECOMMENDATIONS['sii']!,
  references: REFERENCES['sii']!,
  requiredBiomarkers: ['Platelets', 'Neutrophils_Abs', 'Lymphocytes_Abs'],
  riskZones: [
    { color: 'emerald', label: 'Baixa', level: 'low', max: 500, min: 0 },
    { color: 'amber', label: 'Moderada', level: 'moderate', max: 900, min: 500 },
    { color: 'red', label: 'Alta', level: 'high', max: 3000, min: 900 },
  ],
};

const nlr: CalculatorDefinition = {
  biomarkerDirections: { Lymphocytes_Abs: -1, Neutrophils_Abs: 1 },
  calculate: calculateNLR,
  description: 'Razão neutrófilos/linfócitos — marcador inflamatório',
  detail: DETAILS['nlr']!,
  domain: 'inflammation',
  formatValue: (v) => v.toFixed(1),
  formula: 'Neutrófilos / Linfócitos',
  id: 'nlr',
  name: 'NLR',
  recommendations: RECOMMENDATIONS['nlr']!,
  references: REFERENCES['nlr']!,
  requiredBiomarkers: ['Neutrophils_Abs', 'Lymphocytes_Abs'],
  riskZones: [
    { color: 'emerald', label: 'Normal', level: 'low', max: 2.0, min: 0 },
    { color: 'amber', label: 'Leve', level: 'moderate', max: 3.0, min: 2.0 },
    { color: 'orange', label: 'Moderada', level: 'high', max: 5.0, min: 3.0 },
    { color: 'red', label: 'Muito alto', level: 'very-high', max: 15, min: 5.0 },
  ],
};

// --- Exports ---

export const CALCULATOR_REGISTRY: CalculatorDefinition[] = [
  // Liver
  fib4,
  apri,
  fli,
  // Cardiovascular
  aip,
  castelliI,
  castelliII,
  ascvd,
  // Insulin Resistance
  tyg,
  homaIr,
  // Kidney
  egfr,
  // Inflammation
  sii,
  nlr,
];

export const DOMAIN_LABELS: Record<string, { description: string; label: string }> = {
  cardiovascular: {
    description: 'Índices lipídicos e risco de eventos cardiovasculares',
    label: 'Risco Cardiovascular',
  },
  inflammation: {
    description: 'Marcadores de inflamação sistêmica derivados do hemograma',
    label: 'Inflamação',
  },
  'insulin-resistance': {
    description: 'Avaliação de resistência à insulina e risco metabólico',
    label: 'Resistência à Insulina',
  },
  kidney: {
    description: 'Estimativa da taxa de filtração glomerular',
    label: 'Função Renal',
  },
  liver: {
    description: 'Índices não invasivos de fibrose e esteatose hepática',
    label: 'Saúde do Fígado',
  },
};
