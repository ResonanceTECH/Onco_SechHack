import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { FadeIn } from '../ui/FadeIn';

const topCards = [
  {
    title: 'Проверка за секунды',
    description:
      'Полная верификация плана лечения за считанные секунды вместо часов ручного анализа.',
    placeholder: 'Скрин: Быстрый результат',
  },
  {
    title: 'Командная работа в реальном времени',
    description:
      'Врачи-онкологи совместно проверяют протоколы лечения с мгновенной синхронизацией.',
    placeholder: 'Скрин: Коллаборация',
  },
  {
    title: 'Международные стандарты',
    description:
      'Поддержка рекомендаций Минздрава РФ, NCCN и ESMO в единой системе.',
    placeholder: 'Скрин: Стандарты',
  },
];

const bottomCard = {
  title: 'AI-рекомендации по лечению',
  description:
    'Интеллектуальная система предлагает оптимальные протоколы на основе анализа данных пациента.',
  placeholder: 'Скрин: AI-анализ',
};

export function AdvantagesSection() {
  return (
    <Section id="advantages" bg="white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
          {topCards.map((card, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="bg-white rounded-[20px] border border-[#e8e8e8] px-7 pt-7 pb-5 flex flex-col h-full">
                <h3 className="text-[20px] font-bold text-[#1a1a1a] leading-[1.3] tracking-[-0.01em]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-[1.6] text-[#999]">
                  {card.description}
                </p>
                <div className="mt-5 flex-1 min-h-0">
                  <div className="w-full aspect-[4/3] rounded-[14px] bg-[#f5f5f5] border border-[#ebebeb] flex items-center justify-center overflow-hidden">
                    <span className="text-[13px] text-[#c0c0c0] font-medium">{card.placeholder}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}

          <FadeIn delay={0.25} className="md:col-start-2 md:col-span-2">
            <div className="bg-white rounded-[20px] border border-[#e8e8e8] px-7 md:px-8 pt-7 md:pt-8 pb-5 md:pb-6">
              <h3 className="text-[20px] md:text-[24px] font-bold text-[#1a1a1a] leading-[1.3] tracking-[-0.01em]">
                {bottomCard.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-[#999] max-w-md">
                {bottomCard.description}
              </p>
              <div className="mt-5 md:mt-6">
                <div className="w-full aspect-[21/10] rounded-[14px] bg-[#f5f5f5] border border-[#ebebeb] flex items-center justify-center overflow-hidden">
                  <span className="text-[13px] text-[#c0c0c0] font-medium">{bottomCard.placeholder}</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
