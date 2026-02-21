import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { FadeIn } from '../ui/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';

const screenshots = [
  {
    id: 1,
    main: '/placeholder-screenshot-1.png',
    thumbnail: '/placeholder-thumb-1.png',
    alt: 'Главный экран верификации',
  },
  {
    id: 2,
    main: '/placeholder-screenshot-2.png',
    thumbnail: '/placeholder-thumb-2.png',
    alt: 'Результаты проверки протокола',
  },
  {
    id: 3,
    main: '/placeholder-screenshot-3.png',
    thumbnail: '/placeholder-thumb-3.png',
    alt: 'Детальный отчет с рекомендациями',
  },
];

export function SolutionScreensSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: () => ({
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: () => ({
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <Section bg="gray" className="py-6 md:py-10">
      <Container>
        <FadeIn>
          {/* Белая карточка с закругленными углами и тенью */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-slate-200/50 overflow-hidden">
            {/* Верхняя часть: заголовок слева, мета по центру, кнопка справа */}
            <div className="px-6 md:px-8 lg:px-10 py-5 md:py-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Слева: Заголовок */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
                    ОнкоПротокол+ MVP
                  </h3>
                  <p className="text-sm text-slate-500">
                    В разработке • Скриншоты интерфейса
                  </p>
                </div>

                {/* Справа: View Project кнопка */}
                <div className="flex-shrink-0 flex items-center gap-2.5">
                  <span className="text-sm text-slate-600 whitespace-nowrap">Смотреть проект</span>
                  <button className="w-8 h-8 rounded-full bg-white border border-slate-300 shadow-sm flex items-center justify-center hover:bg-slate-50 hover:border-slate-400 transition-all group">
                    <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Основная область слайдера */}
            <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0"
                >
                  {/* Placeholder для скриншота */}
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center p-6">
                    <div className="w-full h-full rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <div className="w-20 h-20 mx-auto mb-3 rounded-xl bg-slate-700/50 flex items-center justify-center">
                          <svg
                            className="w-10 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-slate-500">Скриншот {currentIndex + 1}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Миниатюры внизу слева (overlay) - перекрывающиеся */}
              <div className="absolute bottom-5 left-5 flex items-end gap-0 z-10">
                {screenshots.map((screenshot, index) => {
                  const isActive = index === currentIndex;
                  const isNext = index === (currentIndex + 1) % screenshots.length;
                  const isPrev = index === (currentIndex - 1 + screenshots.length) % screenshots.length;
                  const isVisible = isActive || isNext || isPrev;

                  if (!isVisible) return null;

                  const offset = index - currentIndex;
                  const absOffset = offset < 0 ? offset + screenshots.length : offset;

                  return (
                    <button
                      key={screenshot.id}
                      onClick={() => goToSlide(index)}
                      className={`relative transition-all duration-300 ${
                        isActive
                          ? 'z-30'
                          : absOffset === 1
                          ? 'z-20 -ml-4'
                          : 'z-10 -ml-4'
                      }`}
                      style={{
                        opacity: isActive ? 1 : absOffset === 1 ? 0.5 : 0.25,
                        transform: `scale(${isActive ? 1 : absOffset === 1 ? 0.92 : 0.85})`,
                      }}
                    >
                      <div
                        className={`w-16 h-11 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all shadow-lg ${
                          isActive ? 'border-white shadow-xl' : 'border-white/30'
                        }`}
                      >
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <span className="text-[9px] md:text-[10px] text-slate-400 font-medium">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Синяя кнопка внизу справа (overlay) */}
              <div className="absolute bottom-5 right-5 z-10">
                <a
                  href="#cta"
                  className="inline-flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs md:text-sm shadow-xl hover:shadow-2xl transition-all duration-200 group"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Начать работу</span>
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
