import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  bg?: 'white' | 'gray' | 'dark';
}

const backgrounds: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-slate-50',
  dark: 'bg-slate-900',
};

export function Section({ children, id, className = '', bg = 'white' }: SectionProps) {
  return (
    <section id={id} className={`py-8 md:py-12 ${backgrounds[bg]} ${className}`}>
      {children}
    </section>
  );
}
