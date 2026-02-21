import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';

const schema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  displayName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', displayName: '' },
  });

  const onSubmit = async (data: FormData) => {
    clearError();
    const ok = await registerUser(data.email, data.password, data.displayName);
    if (ok) navigate('/doctor', { replace: true });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Регистрация</h1>
      {error && (
        <p className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Имя (необязательно)</label>
          <input
            type="text"
            {...register('displayName')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Как к вам обращаться"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Регистрация…' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500 text-center">
        Уже есть аккаунт?{' '}
        <a href="/auth/login" className="text-blue-600 hover:underline">
          Войти
        </a>
      </p>
    </div>
  );
}
