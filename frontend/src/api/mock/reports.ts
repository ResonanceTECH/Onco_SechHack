import type { Report } from '../../types';

export async function mockGetReport(caseId: string): Promise<Report | null> {
  await new Promise((r) => setTimeout(r, 200));
  return {
    caseId,
    status: 'partial',
    summaryCards: [
      { type: 'gaps', count: 1, label: 'Пропуски' },
      { type: 'conflicts', count: 0, label: 'Конфликты' },
      { type: 'sequence', count: 0, label: 'Последовательность' },
      { type: 'insufficient_data', count: 0, label: 'Недостаточно данных' },
    ],
    issues: [
      {
        id: 'iss-1',
        type: 'gap',
        severity: 'major',
        description: 'Не указан уровень PD-L1 для выбора режима иммунотерапии.',
        guidelineQuote: 'Рекомендуется определение PD-L1 перед назначением первой линии.',
        guidelineRef: { guidelineVersion: 'РФ КР 2024', sectionLabel: '4.2.1' },
        missingData: ['PD-L1'],
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}

export async function mockExportPdf(_caseId: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  return 'mock-url-to-pdf';
}

export async function mockGenerateCode(caseId: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 400));
  return `MOCK-CODE-${caseId.slice(-6)}`;
}
