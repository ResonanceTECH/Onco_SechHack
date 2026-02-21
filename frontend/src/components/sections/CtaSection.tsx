import { ArrowRight, Mail } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { FadeIn } from '../ui/FadeIn';

export function CtaSection() {
  return (
    <section id="cta" className="py-8 md:py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)]" />

      <Container className="relative">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Готовы попробовать?
            </h2>
            <p className="text-blue-100 leading-relaxed mb-10 text-lg">
              Запросите демонстрацию или свяжитесь с командой, чтобы обсудить пилотный проект
              для вашей клиники.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="white" size="lg">
                Запросить демо
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                <Mail className="w-4 h-4 mr-2" />
                Связаться с командой
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
