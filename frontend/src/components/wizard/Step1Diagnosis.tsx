import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Step1Data } from '../../types';
import { COMORBIDITY_OPTIONS } from '../../types';
import { detectPII } from '../../utils/detectPII';

const schema = z.object({
  localization: z.string().min(1, 'Укажите локализацию'),
  morphology: z.string().min(1, 'Укажите морфологию/гистологию'),
  stage: z.string().min(1, 'Укажите стадию'),
  tnm: z.string().optional(),
  metastases: z.boolean(),
  metastasesLocations: z.string().optional(),
  ecog: z.string().min(1, 'Укажите ECOG'),
  comorbidities: z.array(z.string()),
}).refine(
  (data: FormData) => {
    const free = [data.localization, data.morphology, data.metastasesLocations].filter(Boolean).join(' ');
    return !detectPII(free);
  },
  { message: 'Обнаружен возможный ввод персональных данных. Вводите только медицинские параметры.', path: ['localization'] }
);

type FormData = z.infer<typeof schema>;

interface Step1DiagnosisProps {
  defaultValues?: Partial<Step1Data>;
  onSubmit: (data: Step1Data) => void;
}

export function Step1Diagnosis({ defaultValues, onSubmit }: Step1DiagnosisProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      localization: defaultValues?.localization ?? '',
      morphology: defaultValues?.morphology ?? '',
      stage: defaultValues?.stage ?? '',
      tnm: defaultValues?.tnm ?? '',
      metastases: defaultValues?.metastases ?? false,
      metastasesLocations: defaultValues?.metastasesLocations ?? '',
      ecog: defaultValues?.ecog ?? '',
      comorbidities: defaultValues?.comorbidities ?? [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-xs text-slate-500">Вводите только медицинские параметры. Не указывайте ФИО, возраст, пол.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Локализация</label>
          <input
            type="text"
            {...register('localization')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Например: верхняя доля правого лёгкого"
          />
          {errors.localization && <p className="mt-1 text-sm text-red-600">{errors.localization.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Морфология/гистология</label>
          <input
            type="text"
            {...register('morphology')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Например: аденокарцинома"
          />
          {errors.morphology && <p className="mt-1 text-sm text-red-600">{errors.morphology.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Стадия (I–IV)</label>
          <select
            {...register('stage')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— выбрать —</option>
            {['I', 'II', 'III', 'IV'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.stage && <p className="mt-1 text-sm text-red-600">{errors.stage.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">TNM (опционально)</label>
          <input
            type="text"
            {...register('tnm')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="T2aN1M0"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="mets" {...register('metastases')} className="rounded" />
        <label htmlFor="mets" className="text-sm text-slate-700">Метастазы</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Локализации метастазов (если есть)</label>
        <input
          type="text"
          {...register('metastasesLocations')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Только медицинские термины"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">ECOG</label>
        <select
          {...register('ecog')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">— выбрать —</option>
          {[0, 1, 2, 3, 4].map((n) => (
            <option key={n} value={String(n)}>{n}</option>
          ))}
        </select>
        {errors.ecog && <p className="mt-1 text-sm text-red-600">{errors.ecog.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Коморбидности</label>
        <select
          multiple
          {...register('comorbidities')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[80px]"
        >
          {COMORBIDITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">Удерживайте Ctrl для выбора нескольких</p>
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500"
      >
        Далее: Анализы и исследования
      </button>
    </form>
  );
}
