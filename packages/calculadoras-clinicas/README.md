# calculadoras-clinicas

Calculadoras clínicas do ecossistema Precisa Saúde, publicadas como
[`@precisa-saude/calculadoras-clinicas`](https://www.npmjs.com/package/@precisa-saude/calculadoras-clinicas).

Pacote **sem dependências de runtime** e independente de framework — apenas
lógica de cálculo. Componentes de UI ficam nos aplicativos consumidores.

## Calculadoras incluídas

| Família                  | Calculadoras                                                              |
| ------------------------ | ------------------------------------------------------------------------- |
| **PhenoAge**             | Idade biológica (Levine et al. 2018)                                      |
| **BrDMrisc**             | Risco de diabetes tipo 2 (Bracco et al. 2023)                             |
| **Derivados**            | HOMA-IR, VLDL, eAG, IMC                                                   |
| **Índices** (`/indices`) | FIB-4, APRI, FLI, AIP, Castelli I/II, ASCVD, TyG, HOMA-IR, eGFR, SII, NLR |

## Instalação

```bash
pnpm add @precisa-saude/calculadoras-clinicas
```

## Uso

```ts
import {
  phenoage,
  brdmrisc,
  computeDerivedBiomarkers,
  indices,
} from '@precisa-saude/calculadoras-clinicas';

// Idade biológica
const pheno = phenoage.calculatePhenoAge({ chronologicalAge: 45 /* ...biomarcadores */ });

// Risco de diabetes
const model = brdmrisc.selectModel({ fpg: 90, hba1c: 5.5 });

// Biomarcadores derivados (HOMA-IR, VLDL, eAG, IMC)
const derived = computeDerivedBiomarkers([{ code: 'Triglycerides', value: 150 }]);

// Índices clínicos
const fib4 = indices.CALCULATOR_REGISTRY.find((c) => c.id === 'fib4');
```

Os índices também podem ser importados via subpath, permitindo tree-shaking
das demais famílias:

```ts
import { CALCULATOR_REGISTRY, DOMAIN_LABELS } from '@precisa-saude/calculadoras-clinicas/indices';
```

> **Nota:** as definições de índices não carregam ícones ou strings de UI — a
> camada de apresentação reanexa ícones e cores no aplicativo consumidor.

## Desenvolvimento

```bash
pnpm install
pnpm turbo run build lint typecheck test
```

Este repositório segue as convenções compartilhadas do ecossistema
(`@precisa-saude/agent-instructions`): pnpm workspaces, Turborepo,
TypeScript strict, Vitest (cobertura mínima de 80%), ESLint/Prettier,
Conventional Commits e `semantic-release`.

## Migração de `@precisa-saude/fhir-calculators`

Este pacote substitui `@precisa-saude/fhir-calculators` (descontinuado),
absorvendo PhenoAge, BrDMrisc e `computeDerivedBiomarkers` e adicionando os
índices clínicos. A superfície pública de `phenoage`, `brdmrisc` e
`computeDerivedBiomarkers` é mantida — basta trocar o nome do pacote no
import.

## Licença

[Apache-2.0](./LICENSE)
