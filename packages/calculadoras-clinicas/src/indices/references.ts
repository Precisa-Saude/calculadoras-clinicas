import type { ScientificReference } from './types';

export const REFERENCES: Record<string, ScientificReference[]> = {
  aip: [
    {
      authors: 'Dobiášová M, Frohlich J.',
      doi: '10.1016/S0009-9120(01)00263-6',
      journal: 'Clinical Biochemistry',
      title:
        'The plasma parameter log (TG/HDL-C) as an atherogenic index: correlation with lipoprotein particle size',
      year: 2001,
    },
    {
      authors: 'Niroumand S, Khajedaluee M, Khadem-Rezaiyan M, et al.',
      journal: 'Medical Journal of the Islamic Republic of Iran',
      title: 'Atherogenic Index of Plasma (AIP): a marker of cardiovascular disease',
      year: 2015,
    },
  ],
  apri: [
    {
      authors: 'Wai CT, Greenson JK, Fontana RJ, et al.',
      doi: '10.1053/jhep.2003.50346',
      journal: 'Hepatology',
      title:
        'A simple noninvasive index can predict both significant fibrosis and cirrhosis in patients with chronic hepatitis C',
      year: 2003,
    },
    {
      authors: 'Lin ZH, Xin YN, Dong QJ, et al.',
      journal: 'Hepatology',
      title:
        'Performance of the aspartate aminotransferase-to-platelet ratio index for the staging of hepatitis C-related fibrosis',
      year: 2011,
    },
  ],
  ascvd: [
    {
      authors: 'Goff DC Jr, Lloyd-Jones DM, Bennett G, et al.',
      doi: '10.1161/01.cir.0000437741.48606.98',
      journal: 'Circulation',
      title: '2013 ACC/AHA Guideline on the Assessment of Cardiovascular Risk',
      year: 2014,
    },
    {
      authors: 'Muntner P, Colantonio LD, Cushman M, et al.',
      journal: 'JAMA',
      title:
        'Validation of the atherosclerotic cardiovascular disease Pooled Cohort risk equations',
      year: 2014,
    },
  ],
  'castelli-i': [
    {
      authors: 'Castelli WP, Abbott RD, McNamara PM.',
      journal: 'Circulation',
      title: 'Summary estimates of cholesterol used to predict coronary heart disease',
      year: 1983,
    },
    {
      authors: 'Sociedade Brasileira de Cardiologia.',
      journal: 'Arquivos Brasileiros de Cardiologia',
      title: 'Atualização da Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose',
      year: 2017,
    },
  ],
  'castelli-ii': [
    {
      authors: 'Castelli WP, Abbott RD, McNamara PM.',
      journal: 'Circulation',
      title: 'Summary estimates of cholesterol used to predict coronary heart disease',
      year: 1983,
    },
    {
      authors: 'Millán J, Pintó X, Muñoz A, et al.',
      journal: 'Vascular Health and Risk Management',
      title:
        'Lipoprotein ratios: physiological significance and clinical usefulness in cardiovascular prevention',
      year: 2009,
    },
  ],
  egfr: [
    {
      authors: 'Inker LA, Eneanya ND, Coresh J, et al.',
      doi: '10.1056/NEJMoa2102953',
      journal: 'New England Journal of Medicine',
      title: 'New creatinine- and cystatin C–based equations to estimate GFR without race',
      year: 2021,
    },
    {
      authors: 'KDIGO.',
      journal: 'Kidney International',
      title:
        'KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease',
      year: 2024,
    },
  ],
  fib4: [
    {
      authors: 'Sterling RK, Lissen E, Clumeck N, et al.',
      doi: '10.1002/hep.21178',
      journal: 'Hepatology',
      title:
        'Development of a simple noninvasive index to predict significant fibrosis in patients with HIV/HCV coinfection',
      year: 2006,
    },
    {
      authors: 'Shah AG, Lydecker A, Murray K, et al.',
      doi: '10.1016/j.cgh.2009.05.033',
      journal: 'Clinical Gastroenterology and Hepatology',
      title:
        'Comparison of noninvasive markers of fibrosis in patients with nonalcoholic fatty liver disease',
      year: 2009,
    },
  ],
  fli: [
    {
      authors: 'Bedogni G, Bellentani S, Miglioli L, et al.',
      doi: '10.1186/1471-230X-6-33',
      journal: 'BMC Gastroenterology',
      title:
        'The Fatty Liver Index: a simple and accurate predictor of hepatic steatosis in the general population',
      year: 2006,
    },
  ],
  'homa-ir': [
    {
      authors: 'Matthews DR, Hosker JP, Rudenski AS, et al.',
      doi: '10.1007/BF00280883',
      journal: 'Diabetologia',
      title:
        'Homeostasis model assessment: insulin resistance and β-cell function from fasting plasma glucose and insulin concentrations in man',
      year: 1985,
    },
    {
      authors: 'Geloneze B, Repetto EM, Geloneze SR, et al.',
      journal: 'Diabetes Research and Clinical Practice',
      title: 'The threshold value for insulin resistance (HOMA-IR) in an admixture population',
      year: 2006,
    },
  ],
  nlr: [
    {
      authors: 'Forget P, Khalifa C, Defour JP, et al.',
      doi: '10.1186/s13104-016-2335-5',
      journal: 'BMC Research Notes',
      title: 'What is the normal value of the neutrophil-to-lymphocyte ratio?',
      year: 2017,
    },
    {
      authors: 'Song M, Graubard BI, Rabkin CS, Engels EA.',
      journal: 'Scientific Reports',
      title: 'Neutrophil-to-lymphocyte ratio and mortality in the United States general population',
      year: 2021,
    },
  ],
  sii: [
    {
      authors: 'Hu B, Yang XR, Xu Y, et al.',
      doi: '10.1158/1078-0432.CCR-14-0442',
      journal: 'Clinical Cancer Research',
      title:
        'Systemic immune-inflammation index predicts prognosis of patients after curative resection for hepatocellular carcinoma',
      year: 2014,
    },
    {
      authors: 'Jin Z, Wu Q, Chen S, et al.',
      journal: 'Frontiers in Cardiovascular Medicine',
      title:
        'The associations of two novel inflammation indexes, SII and SIRI, with the risks of all-cause and cardiovascular mortality',
      year: 2022,
    },
  ],
  tyg: [
    {
      authors: 'Simental-Mendía LE, Rodríguez-Morán M, Guerrero-Romero F.',
      doi: '10.1089/met.2008.0034',
      journal: 'Metabolic Syndrome and Related Disorders',
      title:
        'The product of fasting glucose and triglycerides as surrogate for identifying insulin resistance in apparently healthy subjects',
      year: 2008,
    },
    {
      authors: 'da Silva A, Caldas APS, Hermsdorff HHM, et al.',
      journal: 'Cardiovascular Diabetology',
      title:
        'Triglyceride-glucose index is associated with symptomatic coronary artery disease with type 2 diabetes mellitus in Brazilian patients',
      year: 2019,
    },
  ],
};
