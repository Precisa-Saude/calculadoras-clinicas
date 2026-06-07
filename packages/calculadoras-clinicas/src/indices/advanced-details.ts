import type { RiskZone, ScientificReference } from './types';

export interface AdvancedCalculatorInfo {
  detail: string;
  id: string;
  name: string;
  recommendations: readonly string[];
  references: ScientificReference[];
  riskZones: RiskZone[];
}

export const ADVANCED_CALCULATORS: AdvancedCalculatorInfo[] = [
  {
    detail:
      'O Escore de Saúde Metabólica é um índice composto proprietário que avalia a saúde geral a partir de múltiplos sistemas corporais: metabolismo glicêmico, perfil lipídico, função hepática, função renal, inflamação e equilíbrio hormonal. Cada sistema recebe uma pontuação baseada nos biomarcadores disponíveis e suas posições em relação às faixas de referência. O escore final de 0 a 100 representa uma visão integrada da saúde metabólica, onde valores mais altos indicam melhor saúde. O gráfico radar permite visualizar rapidamente quais sistemas estão otimizados e quais precisam de atenção.',
    id: 'health-score',
    name: 'Saúde Metabólica',
    recommendations: [
      'Praticar atividade física regular combinando exercícios aeróbicos e de resistência',
      'Adotar dieta equilibrada rica em vegetais, frutas, proteínas magras e gorduras saudáveis',
      'Manter peso corporal dentro da faixa saudável (IMC 18,5–24,9)',
      'Priorizar sono de qualidade (7-9h por noite) e gerenciamento de estresse',
      'Realizar check-ups regulares para monitorar todos os sistemas metabólicos',
    ],
    references: [
      {
        authors: 'DeFronzo RA, Ferrannini E, Groop L, et al.',
        doi: '10.1038/nrdp.2015.19',
        journal: 'Nature Reviews Disease Primers',
        title: 'Type 2 diabetes mellitus',
        year: 2015,
      },
    ],
    riskZones: [
      { color: 'red', label: 'Necessita atenção', level: 'high', max: 40, min: 0 },
      { color: 'amber', label: 'Pode melhorar', level: 'moderate', max: 70, min: 40 },
      { color: 'emerald', label: 'Saudável', level: 'low', max: 100, min: 70 },
    ],
  },
  {
    detail:
      'O PhenoAge (Idade Fenotípica) é um algoritmo de idade biológica desenvolvido por Morgan Levine e colaboradores, publicado na revista Aging em 2018. Utiliza 9 biomarcadores sanguíneos de rotina — albumina, fosfatase alcalina, creatinina, proteína C-reativa, glicose, percentual de linfócitos, volume corpuscular médio (VCM), amplitude de distribuição eritrocitária (RDW) e contagem de leucócitos — combinados com a idade cronológica para estimar a "idade biológica" do organismo. Uma idade biológica inferior à cronológica sugere envelhecimento mais lento, enquanto uma idade superior indica envelhecimento acelerado. O algoritmo foi derivado de dados do NHANES III e validado em múltiplas coortes como preditor de mortalidade por todas as causas.',
    id: 'phenoage',
    name: 'Idade Biológica (PhenoAge)',
    recommendations: [
      'Manter níveis de inflamação baixos com dieta anti-inflamatória e exercícios regulares',
      'Controlar glicemia através de alimentação equilibrada e atividade física',
      'Otimizar função renal com hidratação adequada e controle de pressão arterial',
      'Manter albumina em níveis saudáveis com ingestão proteica adequada',
      'Reduzir estresse oxidativo com alimentação rica em antioxidantes (frutas, vegetais coloridos)',
    ],
    references: [
      {
        authors: 'Levine ME, Lu AT, Quach A, et al.',
        doi: '10.18632/aging.101414',
        journal: 'Aging',
        title: 'An epigenetic biomarker of aging for lifespan and healthspan',
        year: 2018,
      },
      {
        authors: 'Liu Z, Kuo PL, Horvath S, et al.',
        doi: '10.1093/gerona/gly060',
        journal: 'The Journals of Gerontology: Series A',
        title:
          'A new aging measure captures morbidity and mortality risk across diverse subpopulations from NHANES IV',
        year: 2018,
      },
    ],
    riskZones: [
      { color: 'emerald', label: 'Mais jovem', level: 'low', max: -0.5, min: -20 },
      { color: 'amber', label: 'Na média', level: 'moderate', max: 0.5, min: -0.5 },
      { color: 'red', label: 'Mais velho', level: 'high', max: 20, min: 0.5 },
    ],
  },
  {
    detail:
      'O BrDMrisc (Brazilian Diabetes Mellitus Risk Score) é um modelo de predição de risco de diabetes tipo 2 desenvolvido especificamente para a população brasileira por Bracco et al. (2023). Utiliza biomarcadores laboratoriais comuns — glicemia de jejum, hemoglobina glicada (HbA1c), colesterol HDL e triglicerídeos — para estimar a probabilidade de desenvolver diabetes tipo 2 em 10 anos. O modelo oferece 14 variantes com diferentes combinações de biomarcadores, selecionando automaticamente a melhor versão disponível com base nos exames do usuário. É o único escore de risco de diabetes validado em coorte brasileira, o que o torna particularmente relevante para nossa população.',
    id: 'brdmrisc',
    name: 'Risco de Diabetes (BrDMrisc)',
    recommendations: [
      'Manter glicemia de jejum e HbA1c dentro das faixas normais com dieta e exercícios',
      'Praticar pelo menos 150 min/semana de atividade física moderada (reduz risco em até 58%)',
      'Reduzir peso corporal se necessário — perda de 5-7% já diminui significativamente o risco',
      'Limitar carboidratos refinados e ultraprocessados, priorizando grãos integrais',
      'Monitorar triglicerídeos e HDL-C, que são preditores independentes de diabetes',
    ],
    references: [
      {
        authors: 'Bracco PA, Gregg EW, Engel A, et al.',
        doi: '10.3389/fendo.2023.1166147',
        journal: 'Frontiers in Endocrinology',
        title:
          'A machine learning approach to predict type 2 diabetes onset in the Brazilian population',
        year: 2023,
      },
      {
        authors: 'Sociedade Brasileira de Diabetes.',
        journal: 'Diretrizes SBD 2023',
        title: 'Diretrizes da Sociedade Brasileira de Diabetes 2023',
        year: 2023,
      },
    ],
    riskZones: [
      { color: 'emerald', label: 'Baixo', level: 'low', max: 10, min: 0 },
      { color: 'amber', label: 'Moderado', level: 'moderate', max: 20, min: 10 },
      { color: 'orange', label: 'Alto', level: 'high', max: 35, min: 20 },
      { color: 'red', label: 'Muito alto', level: 'very-high', max: 100, min: 35 },
    ],
  },
];
