import { useState } from 'react';
import { EmptyState } from '../../components/platform-ui/EmptyState';

const MOCK_NOTIFICATIONS = [
  { id: '1', text: 'Проверка по кейсу «НМРЛ» завершена.', time: '2024-02-20T10:00:00Z', read: false },
  { id: '2', text: 'Обновлена версия гайда РФ КР 2024.', time: '2024-02-19T15:00:00Z', read: true },
];

export function NotificationsPage() {
  const [list] = useState(MOCK_NOTIFICATIONS);

  if (list.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-4">Уведомления</h1>
        <EmptyState title="Нет уведомлений" description="Здесь появятся уведомления о завершённых проверках и обновлениях." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Уведомления</h1>
      <ul className="space-y-2">
        {list.map((n) => (
          <li
            key={n.id}
            className={`rounded-lg border p-4 ${n.read ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'}`}
          >
            <p className="text-sm text-slate-800">{n.text}</p>
            <p className="text-xs text-slate-500 mt-1">{new Date(n.time).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
