import { useState } from 'react';
import {
  BookOpen,
  Scale,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileWarning,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { FadeIn } from '../ui/FadeIn';

const slides = [
  {
    icon: BookOpen,
    label: 'Проблема 01',
    headline: (
      <>
        Более <span className="italic text-blue-600">200 клинических</span>{' '}
        рекомендаций обновляются ежегодно
      </>
    ),
    description:
      'Онкология — одна из самых динамичных областей медицины. Каждый год появляются новые схемы лечения, обновляются дозировки и алгоритмы диагностики.',
    stat1: '200+',
    stat1Label: 'Рекомендаций в онкологии',
    stat2: '×3',
    stat2Label: 'Рост объёма КР за 5 лет',
    bottomText:
      'Ни один врач не в состоянии держать в голове все актуальные версии рекомендаций трёх стандартов одновременно.',
    placeholderIcon: BarChart3,
    placeholderLabel: 'Динамика обновлений КР',
  },
  {
    icon: Scale,
    label: 'Проблема 02',
    headline: (
      <>
        Несоответствие стандартам создаёт{' '}
        <span className="italic text-amber-600">юридические и медицинские</span> риски
      </>
    ),
    description:
      'С 2022 года соблюдение клинических рекомендаций — законодательное требование в РФ. Отклонение без обоснования может повлечь последствия.',
    stat1: '№323',
    stat1Label: 'ФЗ об охране здоровья обязывает следовать КР',
    stat2: '2022',
    stat2Label: 'Год вступления требований в силу',
    bottomText:
      'Клиники несут ответственность за соблюдение стандартов. Автоматическая проверка снижает юридические риски.',
    placeholderIcon: FileWarning,
    placeholderLabel: 'Карта регуляторных требований',
  },
  {
    icon: AlertTriangle,
    label: 'Проблема 03',
    headline: (
      <>
        Пропущенные обследования могут{' '}
        <span className="italic text-red-500">изменить исход</span> лечения пациента
      </>
    ),
    description:
      'Пропуск обязательного обследования, конфликт препаратов, неучтённый фактор риска — всё это можно выявить на этапе планирования.',
    stat1: '~15%',
    stat1Label: 'Протоколов содержат потенциальные несоответствия',
    stat2: '87%',
    stat2Label: 'Пропусков можно предотвратить',
    bottomText:
      'Систематическая сверка протокола с рекомендациями устраняет человеческий фактор на этапе планирования терапии.',
    placeholderIcon: ShieldAlert,
    placeholderLabel: 'Анализ типичных пропусков',
  },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 400 : -400, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -400 : 400, opacity: 0 }),
};

export function ProblemSection() {
  const [[current, direction], setCurrent] = useState([0, 0]);

  const paginate = (dir: number) => {
    setCurrent([(current + dir + slides.length) % slides.length, dir]);
  };

  const slide = slides[current];

  return (
    <Section id="problem" bg="gray" className="py-6 md:py-10">
      <Container>
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* === Bento Grid === */}
                <div className="p-6 md:p-10 lg:p-14">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
                    {/* Row 1 — badge + headline */}
                    <div className="md:col-span-3 flex items-start">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">↗</span>
                        {slide.label}
                      </span>
                    </div>
                    <div className="md:col-span-9">
                      <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-slate-900 leading-[1.15] tracking-tight">
                        {slide.headline}
                      </h2>
                    </div>

                    {/* Row 2 — description | image | stat */}
                    <div className="md:col-span-3 flex flex-col justify-between gap-6 pt-2">
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {slide.description}
                      </p>

                      {/* Big stat — bottom left */}
                      <div>
                        <div className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                          {slide.stat1}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{slide.stat1Label}</p>
                      </div>
                    </div>

                    <div className="md:col-span-5">
                      <div className="aspect-[4/3] rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-3 overflow-hidden">
                        <slide.placeholderIcon className="w-12 h-12 text-slate-300" />
                        <span className="text-sm text-slate-400 font-medium">
                          {slide.placeholderLabel}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-4 flex flex-col justify-between gap-6">
                      {/* Stat top-right */}
                      <div className="text-right">
                        <div className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                          {slide.stat2}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{slide.stat2Label}</p>
                      </div>

                      {/* Text bottom-right */}
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {slide.bottomText}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between px-6 md:px-10 lg:px-14 pb-6 md:pb-10 lg:pb-14 pt-0">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent([i, i > current ? 1 : -1])}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Слайд ${i + 1}`}
                  />
                ))}
                <span className="ml-3 text-sm text-slate-400 tabular-nums">
                  {current + 1}/{slides.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(-1)}
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  aria-label="Предыдущий"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => paginate(1)}
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  aria-label="Следующий"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
