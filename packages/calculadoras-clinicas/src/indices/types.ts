export type RiskLevel = 'high' | 'low' | 'moderate' | 'very-high';

export const getRiskLevelForValue = (value: number, zones: RiskZone[]): RiskLevel | undefined =>
  zones.find((z) => value >= z.min && value < z.max)?.level;

export type CalculatorDomain =
  | 'cardiovascular'
  | 'inflammation'
  | 'insulin-resistance'
  | 'kidney'
  | 'liver';

export interface RiskZone {
  color: string;
  label: string;
  level: RiskLevel;
  max: number;
  min: number;
}

export interface UserInputField {
  key: string;
  label: string;
  max?: number;
  min?: number;
  placeholder?: string;
  type: 'boolean' | 'number';
  unit?: string;
}

export interface CalculatorInputs {
  age?: number;
  biomarkers: Record<string, number>;
  bmi?: number;
  sex?: 'F' | 'M';
  userInputs?: Record<string, boolean | number>;
}

export interface ScientificReference {
  authors: string;
  doi?: string;
  journal: string;
  title: string;
  year: number;
}

export interface CalculatorResult {
  riskLabel: string;
  riskLevel: RiskLevel;
  value: number;
}

export interface CalculatorDefinition {
  /**
   * Sign de cada biomarcador no formato da fórmula: `1` quando aumentar o
   * biomarcador eleva o resultado (posição "numerador"), `-1` quando reduz
   * o resultado (posição "denominador" ou coeficiente negativo). Usado
   * para colorir o delta de cada biomarcador no verso do card pela
   * direção em que o RESULTADO se move, não pela faixa do próprio
   * biomarcador.
   */
  biomarkerDirections?: Record<string, 1 | -1>;
  calculate: (inputs: CalculatorInputs) => number | null;
  description: string;
  detail: string;
  domain: CalculatorDomain;
  formatValue?: (value: number) => string;
  formula: string;
  getRiskZones?: (sex: 'F' | 'M') => RiskZone[];
  id: string;
  name: string;
  recommendations: readonly string[];
  references: ScientificReference[];
  requiredBiomarkers: string[];
  requiredProfile?: ('age' | 'bmi' | 'sex')[];
  riskZones: RiskZone[];
  userInputFields?: UserInputField[];
}
