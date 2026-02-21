export type ReportStatus = 'conforms' | 'partial' | 'non_conforms' | 'insufficient_data';

export type IssueSeverity = 'critical' | 'major' | 'minor';

export type IssueType =
  | 'gap'
  | 'conflict'
  | 'sequence'
  | 'insufficient_data'
  | 'other';

export interface GuidelineRef {
  guidelineVersion: string;
  sectionLabel: string;
  url?: string;
}

export interface Issue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  description: string;
  guidelineQuote?: string;
  guidelineRef?: GuidelineRef;
  missingData?: string[];
  acceptedDeviation?: boolean;
  deviationReasonId?: string;
  deviationComment?: string;
}

export interface ReportSummaryCard {
  type: 'gaps' | 'conflicts' | 'sequence' | 'insufficient_data';
  count: number;
  label: string;
}

export interface Report {
  caseId: string;
  status: ReportStatus;
  summaryCards: ReportSummaryCard[];
  issues: Issue[];
  generatedAt: string;
}

export type PipelineStageName = 'normalization' | 'rag' | 'rules' | 'report';

export type PipelineStageStatus = 'queued' | 'processing' | 'done' | 'failed';

export interface PipelineStage {
  name: PipelineStageName;
  label: string;
  status: PipelineStageStatus;
}

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  conforms: 'Соответствует',
  partial: 'Частично соответствует',
  non_conforms: 'Не соответствует',
  insufficient_data: 'Недостаточно данных',
};

export const SEVERITY_LABELS: Record<IssueSeverity, string> = {
  critical: 'Критично',
  major: 'Существенно',
  minor: 'Незначительно',
};
