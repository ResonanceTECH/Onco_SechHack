import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Step4Data } from '../../types';

const schema = z.object({
  useRF: z.boolean(),
  useNCCN: z.boolean(),
  useESMO: z.boolean(),
  versionId: z.string(),
});

type FormData = z.infer<typeof schema>;

const VERSIONS = [
  { id: 'v1', label: 'Активная (2024)' },
  { id: 'v2', label: 'Резервная (2023)' },
];

interface Step4SourcesProps {
  defaultValues?: Partial<Step4Data>;
  onSubmit: (data: Step4Data) => void;
}

export function Step4Sources({ defaultValues, onSubmit }: Step4SourcesProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      useRF: defaultValues?.useRF ?? true,
      useNCCN: defaultValues?.useNCCN ?? false,
      useESMO: defaultValues?.useESMO ?? false,
      versionId: defaultValues?.versionId ?? 'v1',
      },
  });

  const submit = (data: FormData) => {
    const v = VERSIONS.find((x) => x.id === data.versionId);
    onSubmit({
      useRF: data.useRF,
      useNCCN: data.useNCCN,
      useESMO: data.useESMO,
      versionId: data.versionId,
      versionLabel: v?.label ?? data.versionLabel,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex flex-col gap-2">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('useRF')} className="rounded" /> РФ клинические рекомендации (по умолчанию)
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('useNCCN')} className="rounded" /> NCCN
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('useESMO')} className="rounded" /> ESMO
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Версия</label>
        <select
          {...register('versionId')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
        >
          {VERSIONS.map((v) => (
            <option key={v.id} value={v.id}>{v.label}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500">
        Далее: Подтверждение и запуск
      </button>
    </form>
  );
}
