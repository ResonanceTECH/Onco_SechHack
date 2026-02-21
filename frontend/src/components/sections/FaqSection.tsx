import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { FadeIn } from '../ui/FadeIn';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'Какие протоколы и стандарты поддерживаются?',
    answer:
      'ОнкоПротокол+ проверяет назначения по клиническим рекомендациям Минздрава РФ, NCCN и ESMO. Поддержка других стандартов добавляется по запросу.',
  },
  {
    question: 'Как быстро можно внедрить продукт в клинике?',
    answer:
      'Типичный пилот — от 2 до 4 недель: интеграция с МИС, настройка под ваши протоколы и обучение врачей. Полное внедрение зависит от масштаба клиники.',
  },
  {
    question: 'Нужно ли загружать все данные пациента в систему?',
    answer:
      'Нет. Для верификации достаточно плана лечения и минимального набора данных (нозология, стадия, гистология при необходимости). Персональные данные обрабатываются в соответствии с 152-ФЗ.',
  },
  {
    question: 'Можно ли запросить доработки под нашу клинику?',
    answer:
      'Да. Мы настраиваем рекомендации под локальные протоколы и форматы отчётности. Крупные заказчики могут участвовать в дорожной карте продукта.',
  },
  {
    question: 'Что делать, если результат верификации не устраивает?',
    answer:
      'Вы всегда можете запросить разбор кейса у нашей команды. Мы фиксируем обратную связь и улучшаем алгоритмы — ваши кейсы помогают развивать продукт.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="cta" bg="white" className="relative">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
      <Container className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-start">
          <FadeIn className="lg:sticky lg:top-32">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-[13px] font-medium text-slate-700 mb-6">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              FAQ
            </span>
            <h2 className="text-3xl md:text-[36px] font-bold text-slate-900 leading-[1.2] tracking-[-0.02em]">
              Остались вопросы?<br />Ответим по делу
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-slate-500 max-w-sm">
              Короткие и ясные ответы, чтобы вы могли уверенно оценить продукт и внедрение в вашей клинике.
            </p>
            <Link
              to="/#cta"
              className="inline-flex mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Запросить демо
            </Link>
          </FadeIn>

          <FadeIn className="space-y-3">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
                    isOpen ? 'bg-slate-900' : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span
                      className={`font-medium text-[15px] leading-snug ${
                        isOpen ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`shrink-0 ${isOpen ? 'text-white' : 'text-slate-500'}`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-6 pb-5 pt-0 text-[15px] leading-relaxed text-slate-300"
                          style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                            backgroundSize: '12px 12px',
                          }}
                        >
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
