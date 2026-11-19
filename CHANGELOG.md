## [1.2.1](https://github.com/Precisa-Saude/calculadoras-clinicas/compare/v1.2.0...v1.2.1) (2026-11-19)

### Bug Fixes

* **calculadoras:** leucócitos em grafia de milhar não viram contagem por µL ([#17](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/17)) ([a5992ad](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/a5992adcee7f5b0170660800cb16b6e6b5c6ab4c))

### CI/CD

* adotar tooling v3 versionado com política de revisão ([#14](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/14)) ([180e4bc](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/180e4bc81957bd1e288630037befd325e54befa2))
* ativa a revisão automática dos PRs ([#16](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/16)) ([cbb8110](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/cbb81102f967c0556a85e99479e8b7cd838579a2))
* definir política explícita para revisão externa ([#15](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/15)) ([c3c21c7](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/c3c21c7152c860e60513223adf6f2ba8f2c017c5))

## [1.2.0](https://github.com/Precisa-Saude/calculadoras-clinicas/compare/v1.1.0...v1.2.0) (2026-09-28)

### Features

* **calculadoras:** derivados devolvem as entradas de que saíram ([#13](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/13)) ([73ba0eb](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/73ba0ebda294bd0290c0d5be15257def0dd5aa4e))

### Bug Fixes

* quebra volta a gerar versão maior ([#12](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/12)) ([ac3f4fc](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/ac3f4fcab4c4e2c683a6510694d986037c8a2866))

### CI/CD

* sincroniza template de review-dispatch (pr_number como number) ([#11](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/11)) ([dc05483](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/dc05483cd9f5933b94f14719f2d81c27f2eaf99f))

## [1.1.0](https://github.com/Precisa-Saude/calculadoras-clinicas/compare/v1.0.1...v1.1.0) (2026-08-28)

### Features

* deriva índice de massa muscular da altura do usuário ([#9](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/9)) ([4992eb3](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/4992eb3f26cc8e4bb5d6aa278280304933374b17))

### Bug Fixes

* **ci:** completa o .precisa.json para o doctor voltar a auditar ([#3](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/3)) ([153f150](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/153f15047254d89b4297b7a0f8bda5a36e3e1697)), closes [Precisa-Saude/tooling#42](https://github.com/Precisa-Saude/tooling/issues/42)
* **ci:** guard de release compara desde a última release, não o push ([#8](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/8)) ([b8f5938](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/b8f59382208e29a238dba46e521aa1f9857baa3c))
* **ci:** publish-watch aceita pacote sem tag quando bate com o package.json ([#7](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/7)) ([eac91aa](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/eac91aa3e1103c0262d66b396e48f0fc042d4958)), closes [#48](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/48) [tooling#52](https://github.com/Precisa-Saude/tooling/issues/52)
* **ci:** publish-watch compara a versão do pacote, não a maior tag ([#6](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/6)) ([db912af](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/db912af3e537766bc2dd9f9e932996baf79da29c)), closes [tooling#51](https://github.com/Precisa-Saude/tooling/issues/51)

### CI/CD

* atualizar GitHub Actions para o runtime Node 24 ([#2](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/2)) ([bf1fb7a](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/bf1fb7adf5a5feb0fd0808842fe96b0c30c04588))

### Chores

* **ci:** completa o scaffold e sincroniza templates ([#4](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/4)) ([f679beb](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/f679bebe52b8b9cf116b6922207b90eefcb34785))
* **ci:** sincroniza templates do cli 1.13.1 ([#5](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/5)) ([b6d0086](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/b6d00869d6f5b3394ee27e452f3c36b330926b87)), closes [tooling#47](https://github.com/Precisa-Saude/tooling/issues/47) [tooling#48](https://github.com/Precisa-Saude/tooling/issues/48) [tooling#50](https://github.com/Precisa-Saude/tooling/issues/50)

## [1.0.1](https://github.com/Precisa-Saude/calculadoras-clinicas/compare/v1.0.0...v1.0.1) (2026-06-07)

### Bug Fixes

* **calculadoras:** incluir README e LICENSE no pacote publicado ([#1](https://github.com/Precisa-Saude/calculadoras-clinicas/issues/1)) ([9f1557b](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/9f1557be231a366799caaf6acf5418d20b0a348b))

## 1.0.0 (2026-06-07)

### Features

* **calculadoras:** pacote inicial @precisa-saude/calculadoras-clinicas ([f176ad0](https://github.com/Precisa-Saude/calculadoras-clinicas/commit/f176ad05c9b92d98ed68fcb6f96dc68bf410437d))
