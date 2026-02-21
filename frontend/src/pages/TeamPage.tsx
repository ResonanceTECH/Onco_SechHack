import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Container } from '../components/ui/Container';

const team = [
  { name: 'Алексей', role: 'Product' },
  { name: 'Мария', role: 'Clinical' },
  { name: 'Дмитрий', role: 'Tech' },
];

export function TeamPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-10">
          {/* Left column */}
          <div className="space-y-6">
            {/* Team card */}
            <div className="relative rounded-[24px] bg-[#1a1a1a] p-8 md:p-10 border border-white/5">
              <span className="absolute top-6 right-6 w-6 h-6 text-red-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <path d="M8 4l8 8-8 8" />
                </svg>
              </span>
              <h2 className="text-2xl md:text-[28px] font-bold leading-tight tracking-[-0.02em] max-w-md">
                Команда, которая доводит продукт до результата
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-400 max-w-lg">
                Онкологи, разработчики и эксперты по клиническим рекомендациям работают вместе, чтобы верификация протоколов была быстрой, точной и удобной для врачей.
              </p>
              <div className="flex items-center gap-4 mt-8">
                {team.map((t) => (
                  <div
                    key={t.name}
                    className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-lg font-semibold text-white border-2 border-slate-600"
                  >
                    {t.name.slice(0, 1)}
                  </div>
                ))}
                <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                    <path d="M12 2L15 9l7 1-5 5 1 7-8-4-8 4 1-7-5-5 7-1 3-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Image / quote card */}
            <div className="relative rounded-[24px] overflow-hidden bg-[#1a1a1a] border border-white/5 min-h-[280px]">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/80 via-slate-800/60 to-slate-900" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
              <div className="relative p-8 md:p-10 flex flex-col justify-end min-h-[280px]">
                <h3 className="text-xl md:text-2xl font-bold leading-tight">
                  Продукт, который реально используют в клиниках
                </h3>
                <p className="mt-2 text-[15px] text-slate-300 leading-relaxed max-w-md">
                  Мы делаем не просто софт — мы закрываем боль верификации протоколов. Врачи экономят время, клиники снижают риски.
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Contact form */}
          <div className="rounded-[24px] bg-[#1a1a1a] p-8 md:p-10 border border-white/5 h-fit">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-red-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M8 4l8 8-8 8" />
                </svg>
              </span>
              <span className="text-[13px] font-medium text-slate-400 uppercase tracking-wider">Связаться</span>
            </div>
            <h2 className="text-2xl md:text-[28px] font-bold leading-tight tracking-[-0.02em] mb-8">
              Напишите нам
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-[13px] font-medium text-slate-400 mb-2">
                    Имя
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="Иван"
                    className="w-full bg-transparent border-0 border-b border-slate-600 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-[13px] font-medium text-slate-400 mb-2">
                    Фамилия
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="Иванов"
                    className="w-full bg-transparent border-0 border-b border-slate-600 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-[13px] font-medium text-slate-400 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="w-full bg-transparent border-0 border-b border-slate-600 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-[13px] font-medium text-slate-400 mb-2">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Напишите ваше сообщение..."
                  className="w-full bg-transparent border-0 border-b border-slate-600 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white text-[15px] font-semibold hover:from-red-500 hover:to-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                Отправить
              </button>
              <p className="text-[13px] text-slate-500">
                Отправляя форму, вы соглашаетесь с{' '}
                <a href="#" className="text-slate-400 underline hover:text-white transition-colors">
                  политикой конфиденциальности
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
