import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MessageSquarePlus,
  History,
  BookOpen,
  Bell,
  User,
  HelpCircle,
  Menu,
  X,
  MoreHorizontal,
  Pin,
  PinOff,
  Archive,
  ArchiveRestore,
  Pencil,
  Trash2,
  FolderPlus,
} from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { DOCTOR_NAV } from '../../constants/nav';
import { mockCreateChat } from '../../api/mock';
import { api, USE_REAL_API } from '../../api/http';
import type { ChatCase, ChatGroup } from '../../types';

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
  blocks: [{ type: 'step_prompt' as const, text: 'Выберите тип ввода данных: шаблон (по полям) или текстом. Если начнёте вводить текст в чат — автоматически выберется ввод текстом.' }],
  createdAt: new Date().toISOString(),
};

const MENU_WIDTH = 200;

function InlineRenameInput({
  initialValue,
  onSave,
  onCancel,
  className,
}: {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  className?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const save = () => {
    const trimmed = value.trim();
    if (trimmed) onSave(trimmed);
    else onCancel();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          save();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      }}
      onBlur={save}
      className={className}
      aria-label="Название кейса"
    />
  );
}

function ChatItemMenu({
  chat,
  anchorRect,
  onClose,
  onRename,
  onPin,
  onArchive,
  onDelete,
  onAddGroup,
}: {
  chat: ChatCase;
  anchorRect: DOMRect;
  onClose: () => void;
  onRename: () => void;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onAddGroup: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const spaceBelow = typeof window !== 'undefined' ? window.innerHeight - anchorRect.bottom : 300;
  const openUp = spaceBelow < 280 && anchorRect.top > 280;
  const left = Math.max(8, anchorRect.right - MENU_WIDTH);
  const style: React.CSSProperties = {
    position: 'fixed',
    left,
    ...(openUp
      ? { bottom: typeof window !== 'undefined' ? window.innerHeight - anchorRect.top + 4 : 0 }
      : { top: anchorRect.bottom + 4 }),
    width: MENU_WIDTH,
    zIndex: 10000,
  };

  const menu = (
    <div
      ref={ref}
      role="menu"
      aria-label="Действия с кейсом"
      style={style}
      className="py-1.5 rounded-xl bg-slate-800 border border-slate-600/80 shadow-2xl shadow-black/30 backdrop-blur-sm"
    >
      <button
        type="button"
        role="menuitem"
        onClick={() => { onRename(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/90 transition-colors first:rounded-t-[10px]"
      >
        <Pencil className="w-4 h-4 shrink-0 text-slate-400" />
        Переименовать
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={() => { onPin(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/90 transition-colors"
      >
        {chat.pinned ? <PinOff className="w-4 h-4 shrink-0 text-slate-400" /> : <Pin className="w-4 h-4 shrink-0 text-slate-400" />}
        {chat.pinned ? 'Открепить' : 'Закрепить'}
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={() => { onArchive(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/90 transition-colors"
      >
        {chat.archived ? <ArchiveRestore className="w-4 h-4 shrink-0 text-slate-400" /> : <Archive className="w-4 h-4 shrink-0 text-slate-400" />}
        {chat.archived ? 'Вернуть из архива' : 'В архив'}
      </button>
      <div className="border-t border-slate-600/80 my-1.5" aria-hidden />
      <button
        type="button"
        role="menuitem"
        onClick={() => { onAddGroup(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/90 transition-colors"
      >
        <FolderPlus className="w-4 h-4 shrink-0 text-slate-400" />
        Новая группа
      </button>
      <div className="border-t border-slate-600/80 my-1.5" aria-hidden />
      {!confirmDelete && (
        <button
          type="button"
          role="menuitem"
          onClick={() => setConfirmDelete(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors last:rounded-b-[10px]"
        >
          <Trash2 className="w-4 h-4 shrink-0" />
          Удалить
        </button>
      )}
      {confirmDelete && (
        <div className="px-2.5 pb-2.5 pt-1.5">
          <div className="rounded-lg bg-slate-900/95 border border-red-500/40 px-3 py-2.5 shadow-lg shadow-black/40">
            <p className="text-xs text-slate-100 mb-2">Удалить этот кейс?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-red-500 hover:bg-red-600 text-xs font-medium text-white py-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Удалить
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 inline-flex items-center justify-center rounded-md border border-slate-600 text-xs font-medium text-slate-200 py-1.5 hover:bg-slate-700/80 transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(menu, document.body) : null;
}

export function SidebarChats() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);
  const [menuAnchorRect, setMenuAnchorRect] = useState<DOMRect | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    chats,
    groups,
    activeChatId,
    editingChatId,
    setActiveChatId,
    setEditingChatId,
    setCreatingGroup,
    addChat,
    setMessages,
    updateChat,
    deleteChat,
    hydrateFromStorage,
  } = useChatStore();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const handleNewCheck = async () => {
    let chat;
    if (USE_REAL_API) {
      try {
        const raw = await api.createCase({
          name: 'Новая проверка',
          price: 0,
          is_active: true,
          description: 'Кейс, созданный из интерфейса ОнкоПротокол+',
        });
        const created = (raw as any).data ?? raw;
        chat = {
          id: `case-${created.id}`,
          backendId: created.id,
          title: created.name ?? 'Новая проверка',
          status: 'draft' as const,
          updatedAt: new Date().toISOString(),
        };
      } catch (e) {
        console.error('Failed to create backend case, falling back to mock', e);
        chat = await mockCreateChat('Новая проверка');
      }
    } else {
      chat = await mockCreateChat('Новая проверка');
    }
    addChat(chat);
    setActiveChatId(chat.id);
    setMessages(chat.id, [WELCOME_ASSISTANT]);
    closeSidebar();
    navigate('/doctor/chats');
  };

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const pinned = chats.filter((c) => c.pinned && !c.archived);
  const archived = chats.filter((c) => c.archived);
  const normal = chats.filter((c) => !c.pinned && !c.archived);

  const renderChatList = (list: ChatCase[], title?: string) => (
    <ul className="space-y-0.5">
      {title && (
        <p className="px-2 py-1 text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
      )}
      {list.map((c: ChatCase) => {
        const isActive = c.id === activeChatId;
        const showMenu = menuChatId === c.id;
        const isEditing = editingChatId === c.id;
        return (
          <li key={c.id} className="relative group flex items-stretch">
            {isEditing ? (
              <InlineRenameInput
                initialValue={c.title}
                onSave={(title) => {
                  if (title.trim()) updateChat(c.id, { title: title.trim() });
                  setEditingChatId(null);
                }}
                onCancel={() => setEditingChatId(null)}
                className="flex-1 min-w-0 pl-3 pr-9 py-1.5 rounded-lg text-sm bg-slate-700 text-white border border-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            ) : (
              <>
            <Link
              to="/doctor/chats"
              onClick={() => {
                setActiveChatId(c.id);
                closeSidebar();
              }}
              onDoubleClick={(e) => {
                e.preventDefault();
                setEditingChatId(c.id);
              }}
              className={`
                flex flex-1 min-w-0 items-center gap-1.5 pr-9 pl-3 py-2 rounded-lg text-sm truncate transition-colors
                ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {c.pinned && <Pin className="w-3.5 h-3.5 shrink-0 text-slate-500" />}
              <span className="truncate">{c.title}</span>
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (showMenu) {
                  setMenuChatId(null);
                  setMenuAnchorRect(null);
                } else {
                  setMenuAnchorRect(e.currentTarget.getBoundingClientRect());
                  setMenuChatId(c.id);
                }
              }}
              className={`
                absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 transition-colors
                hover:text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-inset
                ${showMenu ? 'text-white bg-slate-600' : 'group-hover:opacity-100'}
              `}
              aria-label="Действия с кейсом"
              aria-expanded={showMenu}
              aria-haspopup="menu"
            >
              <MoreHorizontal className="w-4 h-4" aria-hidden />
            </button>
            {showMenu && menuAnchorRect && (
              <ChatItemMenu
                chat={c}
                anchorRect={menuAnchorRect}
                onClose={() => { setMenuChatId(null); setMenuAnchorRect(null); }}
                onRename={() => {
                  setMenuChatId(null);
                  setMenuAnchorRect(null);
                  setEditingChatId(c.id);
                }}
                onPin={() => updateChat(c.id, { pinned: !c.pinned })}
                onArchive={() => updateChat(c.id, { archived: !c.archived })}
                onDelete={() => {
                  deleteChat(c.id);
                  setMenuChatId(null);
                  setMenuAnchorRect(null);
                }}
                onAddGroup={() => {
                  setCreatingGroup(true);
                  navigate('/doctor/chats');
                }}
              />
            )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );

  const byGroup = normal.reduce<Record<string, ChatCase[]>>((acc, c) => {
    const key = c.groupId ?? '__none__';
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});
  const groupIds = groups.filter((g) => (byGroup[g.id]?.length ?? 0) > 0).map((g) => g.id);

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
            <div className="px-2 pb-2 space-y-2">
              {pinned.length > 0 && renderChatList(pinned, 'Закреплённые')}
              {groupIds.length > 0 && (
                <>
                  {groupIds.map((gid) => {
                    const g = groups.find((x) => x.id === gid);
                    const list = byGroup[gid] ?? [];
                    if (list.length === 0) return null;
                    return (
                      <div key={gid}>
                        {renderChatList(list, g?.name ?? 'Группа')}
                      </div>
                    );
                  })}
                </>
              )}
              {(byGroup['__none__']?.length ?? 0) > 0 && renderChatList(byGroup['__none__'], 'Кейсы')}
              {archived.length > 0 && renderChatList(archived, 'Архив')}
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
