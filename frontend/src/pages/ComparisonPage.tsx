import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';

const comparisons = [
  {
    competitor: 'Tempus',
    summary:
      'Tempus фокусируется на геномном анализе, но не проверяет соответствие назначений клиническим рекомендациям Минздрава РФ.',
    advantages: [
      'Верификация по российским стандартам',
      'Проверка лекарственных взаимодействий',
      'Мгновенная обратная связь врачу',
    ],
  },
  {
    competitor: 'Flatiron Health',
    summary:
      'Flatiron — платформа для агрегации клинических данных, но не предоставляет AI-верификацию протоколов лечения в реальном времени.',
    advantages: [
      'AI-верификация назначений онлайн',
      'Поддержка NCCN, ESMO и Минздрава РФ',
      'Интеграция в рабочий процесс врача',
    ],
  },
  {
    competitor: 'PathAI',
    summary:
      'PathAI специализируется на патологической диагностике, не покрывая этап назначения терапии и контроля протоколов.',
    advantages: [
      'Контроль полного цикла лечения',
      'Командная верификация протоколов',
      'Автоматические рекомендации по терапии',
    ],
  },
  {
    competitor: 'Lunit',
    summary:
      'Lunit работает с медицинской визуализацией (КТ/рентген), но не анализирует соответствие назначенной терапии стандартам.',
    advantages: [
      'Анализ терапевтических назначений',
      'Мульти-стандартная проверка',
      'Снижение врачебных ошибок на 40%',
    ],
  },
  {
    competitor: 'Ibex Medical',
    summary:
      'Ibex ориентирован на гистопатологию. Не предоставляет инструменты для проверки и оптимизации протоколов лечения.',
    advantages: [
      'Полная проверка плана лечения',
      'Российские и международные гайдлайны',
      'Готовая интеграция с МИС',
    ],
  },
  {
    competitor: 'Paige AI',
    summary:
      'Paige AI помогает патологам с диагностикой, но не участвует в этапе назначения и верификации терапии.',
    advantages: [
      'Верификация терапии, не диагностики',
      'Поддержка коллегиальных решений',
      'Детальные отчёты по отклонениям',
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

export function ComparisonPage() {
  return (
    <div className="pt-28 md:pt-36 pb-16 md:pb-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/40 rounded-[24px] border border-slate-100 px-8 md:px-14 py-12 md:py-16 mb-12 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-52 h-52 bg-indigo-100/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] font-medium text-slate-600 shadow-sm mb-5">
              📊 Сравнение
            </span>
            <h1 className="text-[32px] md:text-[44px] font-bold text-slate-900 leading-[1.15] tracking-[-0.02em] max-w-xl">
              ОнкоПротокол+ vs<br />Другие сервисы
            </h1>
            <p className="mt-4 text-[16px] md:text-[17px] leading-[1.65] text-slate-500 max-w-lg">
              Мы изучили каждый аналог на рынке. Узнайте, почему клиники выбирают ОнкоПротокол+, а не другие решения.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {comparisons.map((item, i) => (
            <motion.div
              key={item.competitor}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="bg-white rounded-[20px] border border-[#e8e8e8] p-7 flex flex-col hover:shadow-lg hover:border-slate-200 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[15px] font-bold text-slate-900">ОнкоПротокол+</span>
                <span className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide">vs</span>
                <span className="text-[15px] font-bold text-slate-900">{item.competitor}</span>
              </div>

              <p className="text-[14.5px] leading-[1.65] text-slate-500 mb-5">
                {item.summary}
              </p>

              <div className="space-y-2.5 mb-6 flex-1">
                {item.advantages.map((adv) => (
                  <div key={adv} className="flex items-start gap-2.5">
                    <div className="mt-1 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-emerald-600">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-slate-700 leading-snug">{adv}</span>
                  </div>
                ))}
              </div>

              <button className="inline-flex items-center gap-1 text-[14px] font-medium text-blue-600 hover:text-blue-700 transition-colors group">
                Подробнее
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
