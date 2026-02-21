import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowUp, MessageCircle } from 'lucide-react';
const navLinks = [
  { label: 'Проблема', href: '/#problem' },
  { label: 'Решение', href: '/#solution' },
  { label: 'Как работает', href: '/#how-it-works' },
  { label: 'Преимущества', href: '/#advantages' },
  { label: 'Дорожная карта', href: '/roadmap' },
  { label: 'Сравнение', href: '/comparison' },
  { label: 'Команда', href: '/team' },
  { label: 'FAQ', href: '/#cta' },
];

const socialLinks = [
  { label: 'Telegram', href: '#', icon: 'tg' },
  { label: 'Чат', href: '#', icon: 'chat' },
];

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10">
      <footer className="bg-[#e8ecf4] rounded-t-[24px] pt-6 pb-5 md:pt-8 md:pb-6 relative max-w-6xl mx-auto">
        <div className="px-6 sm:px-8 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-5">
          <Link to="/" className="text-xl font-bold text-slate-800 shrink-0">
            Онко<span className="text-blue-600">Протокол+</span>
          </Link>
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.icon}
                href={s.href}
                aria-label={s.label}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                {s.icon === 'tg' ? (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                ) : (
                  <MessageCircle className="w-5 h-5" />
                )}
              </a>
            ))}
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-1.5 mb-4">
          {navLinks.map((link) =>
            link.href.startsWith('/#') ? (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-slate-800 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="text-[15px] font-medium text-slate-800 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          <a
            href="mailto:sales@oncoprotocol.ru"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-slate-800 hover:text-blue-600 transition-colors"
          >
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            sales@oncoprotocol.ru
          </a>
          <a
            href="tel:+78001234567"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-slate-800 hover:text-blue-600 transition-colors"
          >
            <Phone className="w-4 h-4 text-blue-600 shrink-0" />
            8 (800) 123-45-67
          </a>
        </div>
        <p className="text-[13px] text-slate-500 mb-4">
          Звонки принимаются с 10:00 до 19:00 по московскому времени
        </p>

        <div className="text-center mb-4">
          <Link
            to="/#cta"
            className="text-[15px] font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
          >
            Запросить демо
          </Link>
        </div>

        <div className="text-[13px] text-slate-500 text-center">
          © {new Date().getFullYear()} ОнкоПротокол+
        </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Наверх"
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-violet-500 hover:bg-slate-50 transition-colors z-40"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
