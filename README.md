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

// Biomarcadores derivados (HOMA-IR, VLDL, eAG, IMC). Cada um traz em `inputs`
// os códigos de que saiu, para quem publica dizer de onde veio o valor.
const derived = computeDerivedBiomarkers([{ code: 'Triglycerides', value: 150 }]);
// → [{ code: 'VLDL', inputs: ['Triglycerides'], value: 30, ... }]

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

## Tooling versionado

A configuração deste repositório é mantida localmente. Atualizações de pacotes
e workflows compartilhados chegam pela PR agrupada `precisa-tooling` do
Renovate, com automerge desligado. Os workflows usam SHA com comentário de
versão. Revise o changelog e aguarde o CI antes de adotar cada atualização.

`precisa doctor` verifica requisitos estruturais; lint, build e testes rodam
nos jobs de CI. Para adicionar um arquivo ausente, use
`precisa scaffold --only <caminho> --dry-run`. Arquivos existentes são preservados.

A migração adota o CLI `2.0.0`, publicado no npm, e os workflows compartilhados
da [release v2.0.0](https://github.com/Precisa-Saude/tooling/releases/tag/v2.0.0),
fixados ao SHA `7a61cab18cac4aa7e2163f92dab77209109480de`. A versão e a tag foram
conferidas por `tooling/scripts/prepare-consumers.mjs`; atualizações futuras
continuam sendo revisadas em PRs do Renovate.

### Segurança dos workflows compartilhados

Os workflows e o `precisa doctor` usam tooling v3.0.0. Antes de mesclar esta
migração, a política `.github/review-policy.json` precisa estar em `main`. A
revisão externa começa desativada; sua ativação exige um PR que autorize o
provedor e os caminhos. O workflow lê a política do commit base, filtra o diff
e bloqueia conteúdo sensível antes de qualquer envio. Não há fallback implícito.

Checks têm acesso somente de leitura ao conteúdo. Release e publicação recebem
permissões e segredos específicos para cada job.

A publicação no npm exige aprovação no ambiente `npm-publish`. A recuperação
manual por tag só aceita uma GitHub Release publicada cujo commit pertença à
branch padrão; o checkout usa o SHA resolvido depois dessa validação.
