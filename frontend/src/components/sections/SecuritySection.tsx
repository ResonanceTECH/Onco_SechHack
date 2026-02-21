import { Shield, Lock, UserCheck, Eye } from 'lucide-react';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { FadeIn } from '../ui/FadeIn';

const securityFeatures = [
  {
    icon: Shield,
    title: 'Только медицинские параметры',
    description:
      'Передаются диагноз, стадия и план лечения. ФИО, дата рождения и другие ПДн не требуются.',
  },
  {
    icon: Lock,
    title: 'Шифрование данных',
    description:
      'Все данные передаются по защищённым каналам с использованием современных протоколов шифрования.',
  },
  {
    icon: UserCheck,
    title: 'Врач принимает решения',
    description:
      'Система предоставляет информацию для анализа. Финальное решение всегда остаётся за врачом.',
  },
  {
    icon: Eye,
    title: 'Полная прозрачность',
    description:
      'Каждая рекомендация сопровождается ссылкой на источник. Нет «чёрного ящика».',
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="py-8 md:py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950" />

      <Container className="relative">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge>Безопасность</Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              Безопасность и регуляторика
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Система спроектирована с приоритетом безопасности данных и прозрачности решений.
            </p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-6">
          {securityFeatures.map((feature, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center mb-4 group-hover:bg-blue-500/25 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
