import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Step0Data, ClinicalGoal } from '../../types';
import { CLINICAL_GOAL_LABELS } from '../../types';

const NOSOLOGIES = [
  { id: 'nsclc', name: 'НМРЛ' },
  { id: 'sclc', name: 'МРЛ' },
  { id: 'breast', name: 'РМЖ' },
  { id: 'colorectal', name: 'Колоректальный рак' },
  { id: 'melanoma', name: 'Меланома' },
  { id: 'other', name: 'Другое' },
];

const schema = z.object({
  nosologyId: z.string().min(1, 'Выберите нозологию'),
  nosologyName: z.string().min(1, 'Укажите название'),
  clinicalGoal: z.enum(['neoadjuvant', 'adjuvant', 'first_line', 'second_line', 'palliative']),
});

type FormData = z.infer<typeof schema>;

interface Step0NosologyProps {
  defaultValues?: Partial<Step0Data>;
  onSubmit: (data: Step0Data) => void;
}

export function Step0Nosology({ defaultValues, onSubmit }: Step0NosologyProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nosologyId: defaultValues?.nosologyId ?? '',
      nosologyName: defaultValues?.nosologyName ?? NOSOLOGIES[0]?.name ?? '',
      clinicalGoal: defaultValues?.clinicalGoal ?? 'first_line',
    },
  });

  const nosologyId = watch('nosologyId');
  const selectedNosology = NOSOLOGIES.find((n) => n.id === nosologyId);

  const submit = (data: FormData) => {
    onSubmit({
      nosologyId: data.nosologyId,
      nosologyName: (data.nosologyName.trim() || selectedNosology?.name) ?? 'Другое',
      clinicalGoal: data.clinicalGoal as ClinicalGoal,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-xs text-slate-500">Вводите только медицинские параметры.</p>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Нозология</label>
        <select
          {...register('nosologyId')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">— выбрать —</option>
          {NOSOLOGIES.map((n) => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
        {errors.nosologyId && <p className="mt-1 text-sm text-red-600">{errors.nosologyId.message}</p>}
      </div>
      {nosologyId === 'other' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Название нозологии</label>
          <input
            type="text"
            {...register('nosologyName')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Только медицинские термины"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Клиническая цель</label>
        <select
          {...register('clinicalGoal')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {(Object.entries(CLINICAL_GOAL_LABELS) as [ClinicalGoal, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500"
      >
        Далее: Диагноз
      </button>
    </form>
  );
}
