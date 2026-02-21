import { useEffect, useState } from 'react';
import { mockGetGuidelines } from '../../api/mock/guidelines';
import type { GuidelineVersion } from '../../api/mock/guidelines';
import { EmptyState } from '../../components/platform-ui/EmptyState';

export function GuidelinesPage() {
  const [items, setItems] = useState<GuidelineVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockGetGuidelines().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-4">Библиотека гайдов</h1>
        <p className="text-slate-500">Загрузка…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-4">Библиотека гайдов</h1>
        <EmptyState title="Нет источников" description="Доступные гайды появятся здесь." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Библиотека гайдов</h1>
      <ul className="space-y-3">
        {items.map((g) => (
          <li key={g.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{g.name}</p>
                <p className="text-sm text-slate-500">Версия: {g.version} · {g.status === 'active' ? 'Активен' : 'Архив'}</p>
                {g.releaseNotes && <p className="text-sm text-slate-600 mt-1">{g.releaseNotes}</p>}
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${g.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {g.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
