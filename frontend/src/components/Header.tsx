import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavLink {
  label: string;
  href: string;
  isRoute?: boolean;
}

const navLinks: NavLink[] = [
  { label: 'Проблема', href: '#problem' },
  { label: 'Решение', href: '#solution' },
  { label: 'Как работает', href: '#how-it-works' },
  { label: 'Преимущества', href: '#advantages' },
  { label: 'Дорожная карта', href: '/roadmap', isRoute: true },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div
        className={`w-full max-w-5xl rounded-full px-5 lg:px-8 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-900/95 backdrop-blur-md shadow-lg'
            : 'bg-slate-900/90 backdrop-blur-sm'
        }`}
      >
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="text-lg font-bold text-white shrink-0">
            Онко<span className="text-blue-400">Протокол+</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm transition-colors whitespace-nowrap ${
                    location.pathname === link.href
                      ? 'text-white font-medium'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={isLanding ? link.href : `/${link.href}`}
                  className="text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              to="/auth/login"
              className="inline-flex items-center px-5 py-2 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors border-2 border-blue-500"
            >
              Войти
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex items-center px-5 py-2 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              Регистрация
            </Link>
          </div>

          <button
            className="lg:hidden p-1.5 -mr-1.5 text-white"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Меню"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed top-20 left-4 right-4 lg:hidden bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    location.pathname === link.href
                      ? 'text-white bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={isLanding ? link.href : `/${link.href}`}
                  className="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </a>
              ),
            )}
            <div className="mt-2 flex items-center gap-2">
              <Link
                to="/auth/login"
                className="flex-1 flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors border-2 border-blue-500"
                onClick={() => setIsMobileOpen(false)}
              >
                Войти
              </Link>
              <Link
                to="/auth/register"
                className="flex-1 flex items-center justify-center px-5 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                Регистрация
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
