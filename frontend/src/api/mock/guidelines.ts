export interface GuidelineVersion {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'archived';
  releaseNotes?: string;
  updatedAt: string;
}

const MOCK_GUIDELINES: GuidelineVersion[] = [
  { id: 'rf-1', name: 'РФ Клинические рекомендации', version: '2024', status: 'active', releaseNotes: 'Актуальная версия', updatedAt: '2024-01-15' },
  { id: 'nccn-1', name: 'NCCN', version: '2024.1', status: 'active', updatedAt: '2024-02-01' },
  { id: 'esmo-1', name: 'ESMO', version: '2023', status: 'active', updatedAt: '2023-12-01' },
];

export async function mockGetGuidelines(): Promise<GuidelineVersion[]> {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_GUIDELINES;
}
