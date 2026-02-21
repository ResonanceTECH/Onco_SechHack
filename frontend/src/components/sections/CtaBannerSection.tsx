import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';

export function CtaBannerSection() {
  return (
    <section className="py-8 md:py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[28px] bg-[#3366FF] overflow-hidden flex flex-col md:flex-row items-stretch min-h-[280px] md:min-h-[320px]"
        >
          <div className="absolute bottom-0 right-0 w-[70%] md:w-[50%] h-[80%] bg-gradient-to-tl from-blue-600/40 to-transparent rounded-tl-[100px] pointer-events-none" />

          <div className="relative flex-1 flex flex-col justify-center px-8 md:px-12 py-10 md:py-12">
            <h2 className="text-2xl md:text-[32px] font-bold text-white leading-tight tracking-[-0.02em] max-w-lg">
              Запустите верификацию протоколов в своей клинике
            </h2>
            <p className="mt-3 text-[15px] md:text-base text-white/90 leading-relaxed max-w-md">
              Получите демо и посмотрите, как ОнкоПротокол+ проверяет назначения по Минздраву, NCCN и ESMO за секунды.
            </p>
            <Link
              to="/#cta"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0052CC] text-white text-[15px] font-semibold hover:bg-[#0047B3] transition-colors w-fit"
            >
              Запросить демо
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative flex-shrink-0 w-full md:w-[320px] lg:w-[380px] flex items-center justify-center md:justify-end pr-6 pb-4 md:pb-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <svg
                viewBox="0 0 120 120"
                fill="none"
                className="w-28 h-28 md:w-36 md:h-36 text-white/90"
              >
                <rect x="20" y="30" width="80" height="60" rx="8" stroke="currentColor" strokeWidth="3" fill="none" />
                <path d="M35 50h50M35 60h35M35 70h45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="75" cy="45" r="6" fill="currentColor" fillOpacity="0.5" />
                <path d="M50 95l10-15h20l10 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M60 80v-5a5 5 0 0110 0v5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
