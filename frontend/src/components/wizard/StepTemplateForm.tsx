import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export interface TemplateFormData {
  templateFio?: string;
  templateDateOfBirth?: string;
  templateDiagnosis?: string;
  templateAnamnesis?: string;
}

const schema = z.object({
  fio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  diagnosis: z.string().min(1, 'Укажите диагноз'),
  anamnesis: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface StepTemplateFormProps {
  defaultValues?: Partial<TemplateFormData>;
  onSubmit: (data: TemplateFormData) => void;
  nextLabel?: string;
}

export function StepTemplateForm({ defaultValues, onSubmit, nextLabel = 'Далее: Анализы и исследования' }: StepTemplateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fio: defaultValues?.templateFio ?? '',
      dateOfBirth: defaultValues?.templateDateOfBirth ?? '',
      diagnosis: defaultValues?.templateDiagnosis ?? '',
      anamnesis: defaultValues?.templateAnamnesis ?? '',
    },
  });

  const submit = (data: FormData) => {
    onSubmit({
      templateFio: data.fio?.trim() || undefined,
      templateDateOfBirth: data.dateOfBirth?.trim() || undefined,
      templateDiagnosis: data.diagnosis?.trim(),
      templateAnamnesis: data.anamnesis?.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-xs text-slate-500">
        Вводите только медицинские параметры. Поля ФИО и дата рождения — по необходимости, не передавайте личные данные в открытом виде.
      </p>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">ФИО</label>
        <input
          type="text"
          {...register('fio')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Фамилия И.О."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Дата рождения</label>
        <input
          type="text"
          {...register('dateOfBirth')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="ДД.ММ.ГГГГ"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Диагноз</label>
        <input
          type="text"
          {...register('diagnosis')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Клинический диагноз"
        />
        {errors.diagnosis && <p className="mt-1 text-sm text-red-600">{errors.diagnosis.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Анамнез заболевания</label>
        <textarea
          {...register('anamnesis')}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Краткий анамнез"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
      >
        {nextLabel}
      </button>
    </form>
  );
}
