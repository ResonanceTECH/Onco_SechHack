import { useEffect, useRef } from 'react';
import { FileText, Shield, Globe, CheckCircle } from 'lucide-react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

const protocols = [
  { icon: Shield, text: 'Клинические рекомендации Минздрава РФ' },
  { icon: Globe, text: 'NCCN Guidelines' },
  { icon: Globe, text: 'ESMO Guidelines' },
  { icon: FileText, text: 'Протоколы лечения онкологических заболеваний' },
  { icon: CheckCircle, text: 'Международные стандарты онкологии' },
  { icon: Shield, text: 'Российские клинические рекомендации' },
  { icon: FileText, text: 'Протоколы химиотерапии' },
  { icon: CheckCircle, text: 'Стандарты лучевой терапии' },
  { icon: Globe, text: 'ASCO Guidelines' },
  { icon: Shield, text: 'Протоколы иммунотерапии' },
];

export function ProtocolsSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const scroll = () => {
      scrollPosition += scrollSpeed;
      const maxScroll = container.scrollWidth / 2; // Half because we duplicated

      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }

      container.scrollLeft = scrollPosition;
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Duplicate items for seamless loop
  const duplicatedProtocols = [...protocols, ...protocols];

  return (
    <Section bg="gray" className="py-6 md:py-10">
      <Container>
        <div className="relative overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-hidden scrollbar-hide"
          >
            {duplicatedProtocols.map((protocol, i) => {
              const Icon = protocol.icon;
              return (
                <div
                  key={`${i}-${protocol.text}`}
                  className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-sm shrink-0 whitespace-nowrap hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{protocol.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
