import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

const row1 = [
  {
    name: 'Tempus',
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M8 8h6v16H8V8zm10 0h6v16h-6V8z" fill="white" />
        <path d="M14 14h10v4H14v-4z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Flatiron Health',
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <circle cx="16" cy="16" r="10" stroke="white" strokeWidth="2.5" fill="none" />
        <path d="M16 6a10 10 0 010 20" fill="white" fillOpacity="0.3" />
        <circle cx="16" cy="16" r="4" fill="white" />
      </svg>
    ),
  },
  {
    name: 'PathAI',
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 4l12 7v10l-12 7L4 21V11l12-7z" stroke="white" strokeWidth="2" fill="none" />
        <path d="M16 11l5 3v6l-5 3-5-3v-6l5-3z" fill="white" />
      </svg>
    ),
  },
];

const row2 = [
  {
    name: 'Lunit',
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <circle cx="10" cy="16" r="5" fill="white" />
        <circle cx="22" cy="16" r="5" fill="white" />
        <circle cx="16" cy="10" r="5" fill="white" />
        <circle cx="16" cy="22" r="5" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Ibex Medical',
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 4l3 6h-6l3-6z" fill="white" />
        <path d="M16 28l-3-6h6l-3 6z" fill="white" />
        <path d="M4 16l6-3v6l-6-3z" fill="white" />
        <path d="M28 16l-6 3v-6l6 3z" fill="white" />
        <circle cx="16" cy="16" r="4.5" stroke="white" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Paige AI',
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <rect x="8" y="8" width="7" height="7" rx="1.5" fill="white" />
        <rect x="17" y="8" width="7" height="7" rx="1.5" fill="white" />
        <rect x="8" y="17" width="7" height="7" rx="1.5" fill="white" />
        <rect x="17" y="17" width="7" height="7" rx="1.5" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Oncolytics',
    svg: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 6a10 10 0 110 20" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="16" cy="16" r="4" fill="white" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.4, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 200, damping: 18 },
  },
};

export function AnaloguesSection() {
  return (
    <Section bg="white" className="!py-4 md:!py-6">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="bg-[#0c0c0c] rounded-[22px] px-8 md:px-12 py-8 md:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <motion.div
              className="shrink-0 max-w-xs md:max-w-[280px]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-[22px] md:text-[26px] font-bold text-white leading-[1.25] tracking-[-0.02em]">
                Знаем аналоги
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.65] text-[#777]">
                Изучили лучшие решения на рынке и создали продукт, который идёт дальше.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-5 inline-block">
                <Link
                  to="/comparison"
                  className="inline-flex px-6 py-2.5 rounded-full bg-white text-[#0c0c0c] text-[13px] font-semibold hover:bg-white/90 transition-colors"
                >
                  Все сравнения
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-4 md:gap-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 md:gap-5">
                {row1.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={iconVariants}
                    whileHover={{ scale: 1.12, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-[68px] h-[68px] md:w-[78px] md:h-[78px] rounded-full bg-[#1e1e1e] border border-white/[0.06] flex items-center justify-center cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.4)] hover:bg-[#262626] transition-colors duration-200"
                    title={item.name}
                  >
                    {item.svg}
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-4 md:gap-5">
                {row2.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={iconVariants}
                    whileHover={{ scale: 1.12, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-[68px] h-[68px] md:w-[78px] md:h-[78px] rounded-full bg-[#1e1e1e] border border-white/[0.06] flex items-center justify-center cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.4)] hover:bg-[#262626] transition-colors duration-200"
                    title={item.name}
                  >
                    {item.svg}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
