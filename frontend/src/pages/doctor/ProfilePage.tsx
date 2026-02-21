import { useAuthStore } from '../../stores/authStore';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Профиль и настройки</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
        <p className="text-sm text-slate-600">
          <span className="font-medium">Роль:</span> {user?.role ?? '—'}
        </p>
        <p className="text-sm text-slate-600">
          <span className="font-medium">Email:</span> {user?.email ?? '—'}
        </p>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Источники по умолчанию</label>
          <p className="text-xs text-slate-500">РФ КР — включены. (мок)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Язык</label>
          <select className="mt-1 px-3 py-1.5 border border-slate-300 rounded text-sm">
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );
}
