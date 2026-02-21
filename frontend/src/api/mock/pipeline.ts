import type { PipelineStage } from '../../types';

const STAGES: PipelineStage[] = [
  { name: 'normalization', label: 'Нормализация', status: 'queued' },
  { name: 'rag', label: 'RAG', status: 'queued' },
  { name: 'rules', label: 'Правила', status: 'queued' },
  { name: 'report', label: 'Отчет', status: 'queued' },
];

export async function mockStartVerification(_caseId: string): Promise<PipelineStage[]> {
  await new Promise((r) => setTimeout(r, 300));
  return STAGES.map((s) => ({ ...s }));
}

export async function mockGetPipelineProgress(
  _caseId: string
): Promise<{ stages: PipelineStage[]; done: boolean }> {
  await new Promise((r) => setTimeout(r, 150));
  return {
    stages: [
      { name: 'normalization', label: 'Нормализация', status: 'done' },
      { name: 'rag', label: 'RAG', status: 'done' },
      { name: 'rules', label: 'Правила', status: 'processing' },
      { name: 'report', label: 'Отчет', status: 'queued' },
    ],
    done: false,
  };
}

export async function mockCancelVerification(_caseId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

export async function mockSaveDraft(_caseId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 150));
}
