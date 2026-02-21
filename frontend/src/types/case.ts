export type ClinicalGoal =
  | 'neoadjuvant'
  | 'adjuvant'
  | 'first_line'
  | 'second_line'
  | 'palliative';

export interface Step0Data {
  nosologyId: string;
  nosologyName: string;
  clinicalGoal: ClinicalGoal;
}

export interface Step1Data {
  localization: string;
  morphology: string;
  stage: string;
  tnm?: string;
  metastases: boolean;
  metastasesLocations?: string;
  ecog: string;
  comorbidities: string[];
}

export interface LabItem {
  name: string;
  value: string;
  unit: string;
  outOfRange: boolean;
}

export interface MolecularMarker {
  name: string;
  value: string;
  positive?: boolean;
}

export interface Step2Data {
  labResults: LabItem[];
  hasCT: boolean;
  hasMRI: boolean;
  hasPetCT: boolean;
  hasBiopsy: boolean;
  molecularMarkers: MolecularMarker[];
}

export interface DrugItem {
  name: string;
  dose: string;
  unit: string;
  regimen: string;
  cycles?: number;
  line: string;
}

export interface Step3Data {
  planStages: { stage: number; description: string }[];
  drugs: DrugItem[];
  gcsf: boolean;
  antiemetic: boolean;
  allergiesOrLimits?: string;
}

export interface Step4Data {
  useRF: boolean;
  useNCCN: boolean;
  useESMO: boolean;
  versionId: string;
  versionLabel: string;
}

export interface Step5Data {
  piiConfirmed: boolean;
  piiScanPassed: boolean;
}

export interface CaseDraft {
  step0?: Step0Data;
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
  step4?: Step4Data;
  step5?: Step5Data;
}

export const CLINICAL_GOAL_LABELS: Record<ClinicalGoal, string> = {
  neoadjuvant: 'Неоадъювант',
  adjuvant: 'Адъювант',
  first_line: '1-я линия',
  second_line: '2-я линия',
  palliative: 'Паллиатив',
};

export const COMORBIDITY_OPTIONS = [
  'ХСН',
  'ХПН',
  'Сахарный диабет',
  'Печеночная недостаточность',
  'Другое',
] as const;

export const MOLECULAR_MARKERS = ['PD-L1', 'EGFR', 'ALK', 'BRCA', 'MSI', 'Другое'] as const;
