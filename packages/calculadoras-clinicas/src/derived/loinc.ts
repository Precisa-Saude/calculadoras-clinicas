/**
 * Mapeamento mínimo código interno → LOINC para os biomarcadores derivados.
 *
 * Inlined de `@precisa-saude/fhir` para que este pacote permaneça sem
 * dependências de runtime. Cobre apenas os códigos produzidos por
 * {@link computeDerivedBiomarkers}. Consumidores que precisem do mapa
 * completo do ecossistema podem injetá-lo via `DerivedOptions.codeToLoinc`.
 *
 * Valores LOINC conferidos contra `BIOMARKER_DEFINITIONS` em
 * `@precisa-saude/fhir` (packages/core/src/biomarkers.ts).
 */
const DERIVED_CODE_TO_LOINC: Readonly<Record<string, string>> = Object.freeze({
  BMI: '39156-5',
  eAG: '27353-2',
  HOMA_IR: '47214-2',
  VLDL: '13458-5',
});

export function codeToLoinc(code: string): string | undefined {
  return DERIVED_CODE_TO_LOINC[code];
}
