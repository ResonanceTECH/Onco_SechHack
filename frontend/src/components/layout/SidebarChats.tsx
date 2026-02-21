import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquarePlus, History, BookOpen, Bell, User, HelpCircle, Menu, X } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { DOCTOR_NAV } from '../../constants/nav';
import { mockCreateChat } from '../../api/mock';
import type { ChatCase } from '../../types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Чаты / Кейсы': MessageSquarePlus,
  'История проверок': History,
  'Библиотека гайдов': BookOpen,
  'Уведомления': Bell,
  'Профиль и настройки': User,
  'Помощь / FAQ': HelpCircle,
};

const WELCOME_ASSISTANT = {
  id: 'welcome',
  role: 'assistant' as const,
  blocks: [{ type: 'step_prompt' as const, text: 'Выберите нозологию и клиническую цель.' }],
  createdAt: new Date().toISOString(),
};

export function SidebarChats() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { chats, activeChatId, setActiveChatId, addChat, setMessages } = useChatStore();

  const handleNewCheck = async () => {
    const chat = await mockCreateChat('Новая проверка');
    addChat(chat);
    setActiveChatId(chat.id);
    setMessages(chat.id, [WELCOME_ASSISTANT]);
    closeSidebar();
    navigate('/doctor/chats');
  };

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700"
        onClick={openSidebar}
        aria-label="Открыть меню"
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col
          transform transition-transform duration-200 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-3 flex items-center justify-between border-b border-slate-700">
          <Link to="/doctor/chats" className="font-semibold text-slate-100 truncate">
            Онко<span className="text-blue-400">Протокол+</span>
          </Link>
          <button
            type="button"
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
            onClick={closeSidebar}
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <button
              type="button"
              onClick={handleNewCheck}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium"
            >
              <MessageSquarePlus className="w-4 h-4 shrink-0" />
              Новая проверка
            </button>
          </div>

          {chats.length > 0 && (
            <div className="px-2 pb-2">
              <p className="px-2 py-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Кейсы
              </p>
              <ul className="space-y-0.5">
                {chats.map((c: ChatCase) => {
                  const isActive = c.id === activeChatId;
                  return (
                    <li key={c.id}>
                      <Link
                        to="/doctor/chats"
                        onClick={() => {
                          setActiveChatId(c.id);
                          closeSidebar();
                        }}
                        className={`
                          block px-3 py-2 rounded-lg text-sm truncate transition-colors
                          ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                        `}
                      >
                        {c.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="border-t border-slate-700 mt-2 pt-2 px-2">
            {DOCTOR_NAV.filter((n) => n.path !== '/doctor/chats').map((item) => {
              const Icon = iconMap[item.label];
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                    ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={closeSidebar}
          aria-hidden
        />
      )}
    </>
  );
}
