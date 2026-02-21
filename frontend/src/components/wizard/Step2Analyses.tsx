import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Step2Data, LabItem, MolecularMarker } from '../../types';
import { MOLECULAR_MARKERS } from '../../types';

const schema = z.object({
  hasCT: z.boolean(),
  hasMRI: z.boolean(),
  hasPetCT: z.boolean(),
  hasBiopsy: z.boolean(),
  labJson: z.string().optional(),
  markersJson: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Step2AnalysesProps {
  defaultValues?: Partial<Step2Data>;
  onSubmit: (data: Step2Data) => void;
  onCheckCompleteness?: () => void;
}

export function Step2Analyses({ defaultValues, onSubmit, onCheckCompleteness }: Step2AnalysesProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      hasCT: defaultValues?.hasCT ?? false,
      hasMRI: defaultValues?.hasMRI ?? false,
      hasPetCT: defaultValues?.hasPetCT ?? false,
      hasBiopsy: defaultValues?.hasBiopsy ?? false,
      labJson: defaultValues?.labResults?.length
        ? JSON.stringify(defaultValues.labResults, null, 0)
        : '',
      markersJson: defaultValues?.molecularMarkers?.length
        ? JSON.stringify(defaultValues.molecularMarkers, null, 0)
        : '',
    },
  });

  const submit = (data: FormData) => {
    let labResults: LabItem[] = [];
    let molecularMarkers: MolecularMarker[] = [];
    try {
      if (data.labJson?.trim()) labResults = JSON.parse(data.labJson);
    } catch {}
    try {
      if (data.markersJson?.trim()) molecularMarkers = JSON.parse(data.markersJson);
    } catch {}
    onSubmit({
      labResults: Array.isArray(labResults) ? labResults : [],
      hasCT: data.hasCT,
      hasMRI: data.hasMRI,
      hasPetCT: data.hasPetCT,
      hasBiopsy: data.hasBiopsy,
      molecularMarkers: Array.isArray(molecularMarkers) ? molecularMarkers : [],
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-xs text-slate-500">Вводите только медицинские параметры.</p>
      <div className="flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('hasCT')} className="rounded" /> КТ
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('hasMRI')} className="rounded" /> МРТ
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('hasPetCT')} className="rounded" /> ПЭТ-КТ
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('hasBiopsy')} className="rounded" /> Биопсия
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Лабораторные (JSON или текст)</label>
        <textarea
          {...register('labJson')}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
          placeholder='[{"name":"Hb","value":"120","unit":"g/l","outOfRange":false}]'
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Молекулярные маркеры (PD-L1, EGFR, ALK, BRCA, MSI…)</label>
        <textarea
          {...register('markersJson')}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
          placeholder='[{"name":"PD-L1","value":"50%","positive":true}]'
        />
        <p className="text-xs text-slate-500 mt-1">Можно: {MOLECULAR_MARKERS.join(', ')}</p>
      </div>
      {onCheckCompleteness && (
        <button
          type="button"
          onClick={onCheckCompleteness}
          className="text-sm text-blue-600 hover:underline"
        >
          Проверить полноту данных
        </button>
      )}
      <button type="submit" className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500">
        Далее: Назначения
      </button>
    </form>
  );
}
