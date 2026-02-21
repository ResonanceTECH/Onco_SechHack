import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useChatStore } from '../../stores/chatStore';
import { EmptyState } from '../../components/platform-ui/EmptyState';

export function HistoryPage() {
  const { chats } = useChatStore();
  const [filterStatus, setFilterStatus] = useState<string>('');

  const list = filterStatus
    ? chats.filter((c: { status: string }) => c.status === filterStatus)
    : chats;

  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">История проверок</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
        >
          <option value="">Все статусы</option>
          <option value="draft">Черновик</option>
          <option value="wizard">Заполнение</option>
          <option value="verifying">Проверка</option>
          <option value="done">Готово</option>
          <option value="failed">Ошибка</option>
        </select>
      </div>
      {list.length === 0 ? (
        <EmptyState
          title="Нет проверок"
          description={filterStatus ? 'Нет проверок с выбранным статусом.' : 'Создайте новую проверку в разделе «Чаты».'}
        />
      ) : (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-slate-700">Название</th>
                <th className="text-left px-4 py-2 font-medium text-slate-700">Статус</th>
                <th className="text-left px-4 py-2 font-medium text-slate-700">Обновлён</th>
                <th className="text-left px-4 py-2 font-medium text-slate-700"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((c: { id: string; title: string; status: string; updatedAt: string }) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-800">{c.title}</td>
                  <td className="px-4 py-2 text-slate-600">{c.status}</td>
                  <td className="px-4 py-2 text-slate-500">{new Date(c.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={c.status === 'done' ? `/doctor/check/${c.id}/report` : '/doctor/chats'}
                      className="text-blue-600 hover:underline"
                    >
                      {c.status === 'done' ? 'Отчёт' : 'Открыть'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
