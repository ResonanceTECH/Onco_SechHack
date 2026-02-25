import { PanelLeft, PanelRight, LayoutPanelTop } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useLayoutStore } from '../../stores/layoutStore';
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

const btnClass =
  'p-2 rounded-lg border text-slate-600 hover:bg-slate-100 hover:text-slate-800 border-slate-200 transition-colors';
const btnActiveClass = 'bg-slate-200 border-slate-300 text-slate-800';

export function TopBar() {
  const { chats, activeChatId } = useChatStore();
  const { leftPanelOpen, middlePanelOpen, rightPanelOpen, toggleLeftPanel, toggleMiddlePanel, toggleRightPanel } =
    useLayoutStore();
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
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={toggleLeftPanel}
          className={`${btnClass} ${leftPanelOpen ? btnActiveClass : ''}`}
          title={leftPanelOpen ? 'Свернуть левое меню' : 'Открыть левое меню'}
          aria-label={leftPanelOpen ? 'Свернуть левое меню' : 'Открыть левое меню'}
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleMiddlePanel}
          className={`${btnClass} ${middlePanelOpen ? btnActiveClass : ''}`}
          title={middlePanelOpen ? 'Свернуть среднюю панель' : 'Открыть среднюю панель'}
          aria-label={middlePanelOpen ? 'Свернуть среднюю панель' : 'Открыть среднюю панель'}
        >
          <LayoutPanelTop className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleRightPanel}
          className={`${btnClass} ${rightPanelOpen ? btnActiveClass : ''}`}
          title={rightPanelOpen ? 'Свернуть отчёт' : 'Открыть отчёт'}
          aria-label={rightPanelOpen ? 'Свернуть отчёт' : 'Открыть отчёт'}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
