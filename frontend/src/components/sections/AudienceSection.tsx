import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { FadeIn } from '../ui/FadeIn';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [
  {
    id: 'doctors',
    label: 'Врачи-онкологи',
    title: 'Для врачей-онкологов',
    description: 'Идеально для специалистов, которым нужна быстрая верификация плана перед консилиумом.',
    features: [
      'Верификация за секунды',
      'Соответствие Минздрав / NCCN / ESMO',
      'Прозрачные рекомендации',
      'Меньше рутины, больше пациентов',
      'Доказательная база в один клик',
      'Готовность к консилиуму',
    ],
  },
  {
    id: 'clinics',
    label: 'Руководство клиник',
    title: 'Для руководителей клиник',
    description: 'Для тех, кому нужен системный контроль качества протоколов и снижение рисков.',
    features: [
      'Контроль качества протоколов',
      'Комплаенс с рекомендациями',
      'Аналитика по отделениям',
      'Снижение юридических рисков',
      'Единые стандарты в клинике',
      'Отчётность для регуляторов',
    ],
  },
  {
    id: 'institutes',
    label: 'Институты',
    title: 'Для медицинских институтов',
    description: 'Инструмент для обучения, исследований и стандартизации верификации протоколов.',
    features: [
      'Обучение на реальных кейсах',
      'Исследования и публикации',
      'Стандартизация подходов',
      'Интеграция в учебные программы',
      'База актуальных рекомендаций',
      'Коллаборация с клиниками',
    ],
  },
];

export function AudienceSection() {
  const [activePlan, setActivePlan] = useState(0);
  const plan = plans[activePlan];

  return (
    <Section id="audience" bg="gray">
      <Container>
        <FadeIn>
          <h2 className="text-center text-3xl md:text-4xl font-bold text-slate-900 tracking-[-0.02em] mb-12">
            Понятная ценность, понятный результат
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="max-w-3xl mx-auto rounded-[24px] bg-white border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                <p className="text-[15px] leading-relaxed text-slate-500 max-w-md">
                  Кому подходит продукт
                </p>

                <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 shrink-0">
                  {plans.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePlan(i)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activePlan === i
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <h3 className="text-2xl md:text-[28px] font-bold text-slate-900 leading-tight tracking-[-0.02em] mb-1">
                {plan.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-500 max-w-lg mb-6">
                {plan.description}
              </p>

              <p className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Что входит
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8"
                >
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                      </div>
                      <span className="text-[15px] text-slate-700 leading-snug">{feature}</span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
                <p className="text-slate-500 text-sm">
                  Подходит вашей роли? Обсудим внедрение под ваши процессы.
                </p>
                <Link
                  to="/#cta"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[15px] font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/30 hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shrink-0"
                >
                  Запросить демо
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
