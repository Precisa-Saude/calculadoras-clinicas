/**
 * @precisa-saude/calculadoras-clinicas
 *
 * Calculadoras clínicas — PhenoAge, BrDMrisc, biomarcadores derivados e
 * índices clínicos (FIB-4, APRI, FLI, AIP, Castelli I/II, ASCVD, TyG,
 * HOMA-IR, eGFR, SII, NLR).
 */

// PhenoAge — namespaced to avoid collisions with BrDMrisc/indices
export * as phenoage from './phenoage';

// BrDMrisc — namespaced to avoid collisions with PhenoAge/indices
export * as brdmrisc from './brdmrisc';

// Biomarcadores derivados (HOMA-IR, VLDL, eAG, IMC)
export type { BiomarkerInput, DerivedBiomarker, DerivedOptions } from './derived';
export { computeDerivedBiomarkers } from './derived';

// Índices clínicos — namespaced; também disponível via subpath `/indices`
export * as indices from './indices';
