import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import type { CaseStatus, ChatCase } from '../../types';

const STATUS_LABELS: Record<CaseStatus, string> = {
  draft: 'Черновик',
  wizard: 'Заполнение',
  verifying: 'Проверка',
  done: 'Готово',
  failed: 'Ошибка',
  cancelled: 'Отменено',
};

const statusColor: Record<CaseStatus, string> = {
  draft: 'bg-slate-500',
  wizard: 'bg-amber-500',
  verifying: 'bg-blue-500',
  done: 'bg-emerald-500',
  failed: 'bg-red-500',
  cancelled: 'bg-slate-400',
};

export function TopBar() {
  const { chats, activeChatId } = useChatStore();
  const active = activeChatId ? chats.find((c: ChatCase) => c.id === activeChatId) : null;

  const title = active
    ? [active.nosology, active.stage].filter(Boolean).join(' — ') || active.title
    : 'Выберите кейс или создайте новую проверку';

  return (
    <header className="h-14 shrink-0 border-b border-slate-200 bg-white px-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-slate-700 font-medium truncate">{title}</span>
        {active && (
          <span
            className={`
              shrink-0 px-2 py-0.5 rounded text-xs font-medium text-white
              ${statusColor[active.status as keyof typeof statusColor] ?? 'bg-slate-500'}
            `}
          >
            {STATUS_LABELS[active.status as CaseStatus]}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {active?.id && (
          <Link
            to={`/doctor/check/${active.id}/report`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 border border-slate-200"
          >
            <FileText className="w-4 h-4" />
            Отчет
          </Link>
        )}
      </div>
    </header>
  );
}
