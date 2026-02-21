import { CheckCircle2, Search, FileText, Lock } from 'lucide-react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Badge } from '../ui/Badge';
import { FadeIn } from '../ui/FadeIn';
import { Placeholder } from '../ui/Placeholder';
import { BarChart3 } from 'lucide-react';

const features = [
  {
    icon: CheckCircle2,
    title: 'Проверка соответствия',
    description:
      'Автоматическое сопоставление плана лечения с актуальными клиническими рекомендациями.',
  },
  {
    icon: Search,
    title: 'Выявление пропусков',
    description:
      'Обнаружение пропущенных обследований, этапов диагностики и потенциальных конфликтов терапии.',
  },
  {
    icon: FileText,
    title: 'Ссылки на источники',
    description:
      'Каждое замечание сопровождается ссылкой на конкретный пункт рекомендаций.',
  },
  {
    icon: Lock,
    title: 'Обезличенный формат',
    description:
      'Передаются только медицинские параметры — диагноз, стадия, план лечения. Без персональных данных.',
  },
];

export function SolutionSection() {
  return (
    <Section id="solution">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div>
              <Badge variant="green">Решение</Badge>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
                AI-верификация, которой можно доверять
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed mb-8">
                Система анализирует план лечения и сверяет его с актуальными рекомендациями
                Минздрава РФ, NCCN и ESMO, формируя прозрачный и структурированный отчёт.
              </p>
              <Placeholder
                icon={<BarChart3 className="w-10 h-10" />}
                label="Диаграмма архитектуры системы"
                className="max-w-md"
              />
            </div>
          </FadeIn>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <FadeIn key={i} delay={i * 0.1} direction="right">
                <div className="flex gap-4 p-5 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <feature.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
