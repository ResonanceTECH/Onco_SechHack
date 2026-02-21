import { useState, useRef, useEffect, useMemo } from 'react';
import { CheckCircle, Layers, Plug, FileText, Globe, Brain, Shield, GitBranch, BarChart3, Smartphone, ChevronDown, Search, X, SlidersHorizontal } from 'lucide-react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Badge } from '../ui/Badge';
import { FadeIn } from '../ui/FadeIn';
import { AnimatePresence, motion } from 'framer-motion';

const ALL_EMOJIS = ['👍', '🎉', '😢', '💔', '🙏', '😆', '🤔', '🚀', '❤️', '👀', '💯', '🔥', '✅', '⭐', '💡', '🎯'];
const QUICK_EMOJIS = ['🎉', '😢', '💔', '🙏', '😆'];

interface Reaction {
  emoji: string;
  count: number;
  active: boolean;
}

interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  defaultReactions?: { emoji: string; count: number }[];
  tags?: string[];
  assignee?: string;
}

interface RoadmapColumn {
  title: string;
  count: number;
  color: string;
  dotColor: string;
  tasks: RoadmapTask[];
}

const columns: RoadmapColumn[] = [
  {
    title: 'На очереди',
    count: 6,
    color: 'border-slate-300',
    dotColor: 'bg-slate-400',
    tasks: [
      {
        id: 'mis',
        title: 'Интеграция с МИС',
        description: 'REST API и HL7 FHIR для подключения к медицинским информационным системам',
        icon: Plug,
        defaultReactions: [{ emoji: '👍', count: 12 }],
        tags: ['API'],
      },
      {
        id: 'mobile',
        title: 'Мобильное приложение',
        description: 'Доступ к верификации протоколов с мобильных устройств',
        icon: Smartphone,
        defaultReactions: [{ emoji: '👍', count: 8 }],
      },
      {
        id: 'analytics',
        title: 'Аналитика и дашборды',
        description: 'Статистика проверок, выявленных несоответствий и трендов',
        icon: BarChart3,
        defaultReactions: [{ emoji: '👍', count: 6 }],
      },
    ],
  },
  {
    title: 'В приоритете',
    count: 5,
    color: 'border-amber-400',
    dotColor: 'bg-amber-400',
    tasks: [
      {
        id: 'noso',
        title: 'Расширение нозологий',
        description: 'Добавление рака лёгкого, колоректального рака и ещё 7+ нозологий',
        icon: Layers,
        defaultReactions: [{ emoji: '😆', count: 10 }, { emoji: '🔥', count: 1 }],
        tags: ['Контент'],
      },
      {
        id: 'esmo',
        title: 'ESMO Guidelines',
        description: 'Подключение европейских клинических рекомендаций',
        icon: Globe,
        defaultReactions: [{ emoji: '👍', count: 10 }],
        tags: ['Стандарты'],
      },
      {
        id: 'versioning',
        title: 'Версионирование КР',
        description: 'Отслеживание и сравнение версий клинических рекомендаций',
        icon: GitBranch,
        defaultReactions: [{ emoji: '👍', count: 7 }],
      },
    ],
  },
  {
    title: 'В работе',
    count: 4,
    color: 'border-blue-500',
    dotColor: 'bg-blue-500',
    tasks: [
      {
        id: 'rmj',
        title: 'Верификация РМЖ',
        description: 'Полная проверка протоколов лечения рака молочной железы по КР МЗ РФ и NCCN',
        icon: CheckCircle,
        defaultReactions: [{ emoji: '😆', count: 44 }, { emoji: '🎉', count: 3 }, { emoji: '🔥', count: 2 }, { emoji: '🙏', count: 2 }],
        tags: ['MVP'],
        assignee: 'Команда',
      },
      {
        id: 'reports',
        title: 'Генерация отчётов',
        description: 'Структурированный отчёт со ссылками на пункты рекомендаций',
        icon: FileText,
        defaultReactions: [{ emoji: '👍', count: 18 }],
        tags: ['MVP'],
      },
      {
        id: 'conflicts',
        title: 'AI-анализ конфликтов',
        description: 'Выявление потенциальных конфликтов терапии и лекарственных взаимодействий',
        icon: Brain,
        defaultReactions: [{ emoji: '👍', count: 22 }],
      },
      {
        id: 'privacy',
        title: 'Обезличенная передача данных',
        description: 'Шифрование и передача только медицинских параметров без ПДн',
        icon: Shield,
        defaultReactions: [{ emoji: '👍', count: 30 }],
        tags: ['Безопасность'],
      },
    ],
  },
];

const ALL_TAGS = Array.from(new Set(columns.flatMap((c) => c.tasks.flatMap((t) => t.tags ?? []))));
const FILTER_EMOJIS = Array.from(
  new Set(columns.flatMap((c) => c.tasks.flatMap((t) => (t.defaultReactions ?? []).map((r) => r.emoji)))),
);

// --- Hooks & subcomponents ---

function useReactions(taskId: string, defaults: { emoji: string; count: number }[]) {
  const [reactions, setReactions] = useState<Reaction[]>(() =>
    defaults.map((d) => ({ ...d, active: false })),
  );

  const toggle = (emoji: string) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        if (existing.active) {
          const newCount = existing.count - 1;
          return newCount <= 0
            ? prev.filter((r) => r.emoji !== emoji)
            : prev.map((r) => (r.emoji === emoji ? { ...r, count: newCount, active: false } : r));
        }
        return prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1, active: true } : r,
        );
      }
      return [...prev, { emoji, count: 1, active: true }];
    });
  };

  const emojiSet = useMemo(() => new Set(reactions.map((r) => r.emoji)), [reactions]);

  return { reactions, toggle, emojiSet };
}

function EmojiPicker({ onSelect, onClose }: { onSelect: (emoji: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full left-0 mb-2 z-50 bg-slate-900 rounded-2xl shadow-2xl p-2 grid grid-cols-8 gap-0.5"
    >
      {ALL_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => { onSelect(emoji); onClose(); }}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-lg transition-colors"
        >
          {emoji}
        </button>
      ))}
    </motion.div>
  );
}

function QuickEmojiBar({ onSelect, onOpenFull }: { onSelect: (emoji: string) => void; onOpenFull: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full left-0 mb-2 z-50 bg-slate-900 rounded-full shadow-2xl px-2 py-1.5 flex items-center gap-0.5"
    >
      {QUICK_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-lg transition-colors"
        >
          {emoji}
        </button>
      ))}
      <button
        onClick={onOpenFull}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 transition-colors"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// --- Task Card ---

function TaskCard({ task }: { task: RoadmapTask }) {
  const Icon = task.icon;
  const { reactions, toggle } = useReactions(task.id, task.defaultReactions ?? []);
  const [showQuickBar, setShowQuickBar] = useState(false);
  const [showFullPicker, setShowFullPicker] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowFullPicker(false);
    setShowQuickBar((prev) => !prev);
  };

  const handleSelectFromQuick = (emoji: string) => {
    toggle(emoji);
    setShowQuickBar(false);
  };

  const handleSelectFromFull = (emoji: string) => {
    toggle(emoji);
    setShowFullPicker(false);
  };

  const handleOpenFull = () => {
    setShowQuickBar(false);
    setShowFullPicker(true);
  };

  return (
    <div
      className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 group"
      onContextMenu={handleContextMenu}
    >
      {/* Title + icon */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h4 className="font-semibold text-slate-900 text-sm leading-snug">{task.title}</h4>
        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
          <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* Tags right under title */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex items-center gap-1.5 mb-2.5">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed mb-3">{task.description}</p>

      {/* Reactions */}
      <div className="flex items-center flex-wrap gap-1.5 relative">
        {reactions.map((r) => (
          <button
            key={r.emoji}
            onClick={() => toggle(r.emoji)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border transition-all duration-150 ${
              r.active
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            <span className="text-sm">{r.emoji}</span>
            <span>{r.count}</span>
          </button>
        ))}

        {task.assignee && (
          <span className="ml-auto text-[11px] font-medium text-slate-500">{task.assignee}</span>
        )}

        <AnimatePresence>
          {showQuickBar && !showFullPicker && (
            <QuickEmojiBar
              onSelect={handleSelectFromQuick}
              onOpenFull={handleOpenFull}
            />
          )}
          {showFullPicker && (
            <EmojiPicker
              onSelect={handleSelectFromFull}
              onClose={() => setShowFullPicker(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Filter bar ---

function FilterBar({
  search,
  setSearch,
  activeTag,
  setActiveTag,
  activeEmoji,
  setActiveEmoji,
}: {
  search: string;
  setSearch: (v: string) => void;
  activeTag: string | null;
  setActiveTag: (v: string | null) => void;
  activeEmoji: string | null;
  setActiveEmoji: (v: string | null) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasFilters = search || activeTag || activeEmoji;
  const activeCount = (activeTag ? 1 : 0) + (activeEmoji ? 1 : 0);

  return (
    <div className="mb-8 space-y-3">
      {/* Search + filter icon */}
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск улучшения..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={`relative w-[42px] h-[42px] shrink-0 rounded-xl border flex items-center justify-center transition-all duration-200 ${
            filtersOpen || hasFilters
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
          }`}
        >
          <SlidersHorizontal className="w-[18px] h-[18px]" strokeWidth={1.75} />
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Collapsible filter panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {/* Tags */}
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                    activeTag === tag
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tag}
                </button>
              ))}

              <div className="w-px h-5 bg-slate-200 mx-1" />

              {/* Emoji filters */}
              {FILTER_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setActiveEmoji(activeEmoji === emoji ? null : emoji)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-base border transition-all duration-150 ${
                    activeEmoji === emoji
                      ? 'bg-blue-50 border-blue-300 scale-110'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}

              {hasFilters && (
                <>
                  <div className="w-px h-5 bg-slate-200 mx-1" />
                  <button
                    onClick={() => { setSearch(''); setActiveTag(null); setActiveEmoji(null); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 transition-all"
                  >
                    Сбросить
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main section ---

export function RoadmapSection() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);

  const filteredColumns = useMemo(() => {
    const q = search.toLowerCase().trim();

    return columns.map((col) => {
      const filtered = col.tasks.filter((task) => {
        if (q && !task.title.toLowerCase().includes(q) && !task.description.toLowerCase().includes(q)) {
          return false;
        }
        if (activeTag && !(task.tags ?? []).includes(activeTag)) {
          return false;
        }
        if (activeEmoji && !(task.defaultReactions ?? []).some((r) => r.emoji === activeEmoji)) {
          return false;
        }
        return true;
      });

      return { ...col, tasks: filtered };
    });
  }, [search, activeTag, activeEmoji]);

  const totalFiltered = filteredColumns.reduce((sum, c) => sum + c.tasks.length, 0);
  const totalAll = columns.reduce((sum, c) => sum + c.tasks.length, 0);
  const hasFilters = search || activeTag || activeEmoji;

  return (
    <Section id="roadmap" className="pt-28 md:pt-36">
      <Container>
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge>дорожная карта</Badge>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Что мы делаем:{' '}
              <br className="hidden sm:block" />
              разработка и планы
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <FilterBar
            search={search}
            setSearch={setSearch}
            activeTag={activeTag}
            setActiveTag={setActiveTag}
            activeEmoji={activeEmoji}
            setActiveEmoji={setActiveEmoji}
          />
        </FadeIn>

        {hasFilters && (
          <div className="text-center text-sm text-slate-400 mb-6">
            Найдено {totalFiltered} из {totalAll}
          </div>
        )}

        <FadeIn delay={0.1}>
          <div className="grid md:grid-cols-3 gap-5">
            {filteredColumns.map((column) => (
              <div key={column.title} className="flex flex-col">
                <div className={`flex items-center gap-2.5 pb-4 mb-4 border-b-2 ${column.color}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                  <span className="font-semibold text-slate-900 text-sm">{column.title}</span>
                  <span className="text-sm text-slate-400">{column.tasks.length}</span>
                </div>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {column.tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TaskCard task={task} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {column.tasks.length === 0 && (
                    <div className="text-center py-8 text-sm text-slate-300">Нет задач</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
