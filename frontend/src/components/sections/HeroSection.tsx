import { ArrowRight, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { FadeIn } from '../ui/FadeIn';

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-8 md:pt-32 md:pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-white" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/40 to-transparent" />

      <Container className="relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn>
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 leading-[1.1]">
                Проверка лечебных{' '}
                <br className="hidden sm:block" />
                протоколов{' '}
                <span className="gradient-text">за секунды</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                AI-инструмент сверяет план лечения в онкологии с актуальными клиническими
                рекомендациями Минздрава РФ, NCCN и ESMO — без передачи персональных данных.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" href="#cta">
                  Запросить демо
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="secondary" size="lg" href="#cta">
                  Подключиться к пилоту
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Shield className="w-4 h-4 shrink-0" />
                <span>Система не заменяет врача и не назначает лечение</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="right">
            <ProductMockup />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

const mockItems = [
  { ok: true, text: 'Схема ХТ соответствует рекомендациям NCCN' },
  { ok: true, text: 'Дозировка в пределах нормы' },
  { ok: false, text: 'Не назначена ЭхоКГ перед курсом антрациклинов' },
  { ok: false, text: 'Отсутствует генетическое тестирование BRCA' },
  { ok: true, text: 'Интервал между курсами соответствует протоколу' },
];

function ProductMockup() {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-200" />
          <div className="w-3 h-3 rounded-full bg-slate-200" />
          <div className="w-3 h-3 rounded-full bg-slate-200" />
        </div>
        <span className="ml-3 text-xs text-slate-400 font-medium">
          ОнкоПротокол+ — Результат верификации
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-1">ID-7294 • Верификация</div>
            <div className="font-semibold text-slate-900 text-sm">
              Рак молочной железы, T2N1M0, стадия IIB
            </div>
          </div>
          <span className="shrink-0 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
            2 замечания
          </span>
        </div>

        <div className="space-y-2">
          {mockItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs ${
                item.ok ? 'bg-emerald-50/70' : 'bg-amber-50/70'
              }`}
            >
              {item.ok ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <span className={item.ok ? 'text-emerald-700' : 'text-amber-700'}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          Источники: КР Минздрава РФ 2024 · NCCN Guidelines v4.2024
        </div>
      </div>
    </motion.div>
  );
}
