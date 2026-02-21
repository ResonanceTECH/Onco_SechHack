import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Step3Data, DrugItem } from '../../types';
import { detectPII } from '../../utils/detectPII';

const schema = z.object({
  drugsJson: z.string().optional(),
  gcsf: z.boolean(),
  antiemetic: z.boolean(),
  allergiesOrLimits: z.string().optional(),
}).refine(
  (d: FormData) => !d.allergiesOrLimits || !detectPII(d.allergiesOrLimits),
  { message: 'Не указывайте персональные данные.', path: ['allergiesOrLimits'] }
);

type FormData = z.infer<typeof schema>;

interface Step3PrescriptionsProps {
  defaultValues?: Partial<Step3Data>;
  onSubmit: (data: Step3Data) => void;
}

export function Step3Prescriptions({ defaultValues, onSubmit }: Step3PrescriptionsProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      drugsJson: defaultValues?.drugs?.length ? JSON.stringify(defaultValues.drugs, null, 0) : '',
      gcsf: defaultValues?.gcsf ?? false,
      antiemetic: defaultValues?.antiemetic ?? false,
      allergiesOrLimits: defaultValues?.allergiesOrLimits ?? '',
    },
  });

  const submit = (data: FormData) => {
    let drugs: DrugItem[] = [];
    try {
      if (data.drugsJson?.trim()) drugs = JSON.parse(data.drugsJson);
    } catch {}
    onSubmit({
      planStages: [],
      drugs: Array.isArray(drugs) ? drugs : [],
      gcsf: data.gcsf,
      antiemetic: data.antiemetic,
      allergiesOrLimits: data.allergiesOrLimits?.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-xs text-slate-500">Вводите только медицинские параметры.</p>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Препараты (JSON)</label>
        <textarea
          {...register('drugsJson')}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
          placeholder='[{"name":"Пембролизумаб","dose":"200","unit":"мг","regimen":"каждые 3 нед","cycles":4,"line":"1-я линия"}]'
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('gcsf')} className="rounded" /> G-CSF
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('antiemetic')} className="rounded" /> Антиэметики
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Ограничения/аллергии (только медфакт)</label>
        <input
          type="text"
          {...register('allergiesOrLimits')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
        />
        {errors.allergiesOrLimits && <p className="mt-1 text-sm text-red-600">{errors.allergiesOrLimits.message}</p>}
      </div>
      <button type="submit" className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500">
        Далее: Источники проверки
      </button>
    </form>
  );
}
