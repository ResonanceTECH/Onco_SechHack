import { ClipboardList, Database, SearchCheck, FileCheck } from 'lucide-react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Badge } from '../ui/Badge';
import { FadeIn } from '../ui/FadeIn';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Ввод параметров',
    description: 'Врач вводит диагноз, стадию, текущий план лечения и результаты обследований.',
  },
  {
    number: '02',
    icon: Database,
    title: 'Сопоставление',
    description: 'AI сверяет данные с актуальными клиническими рекомендациями трёх стандартов.',
  },
  {
    number: '03',
    icon: SearchCheck,
    title: 'Анализ',
    description: 'Система выявляет несоответствия, пропуски и потенциальные конфликты терапии.',
  },
  {
    number: '04',
    icon: FileCheck,
    title: 'Отчёт',
    description: 'Формируется структурированный отчёт со ссылками на конкретные пункты рекомендаций.',
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" bg="gray">
      <Container>
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge>Процесс</Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              Как это работает
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Четыре шага от ввода данных до готового отчёта
            </p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-slate-300" />
                )}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-6 shadow-lg shadow-blue-600/20">
                  <step.icon className="w-7 h-7" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center shadow-sm border border-blue-100">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}
