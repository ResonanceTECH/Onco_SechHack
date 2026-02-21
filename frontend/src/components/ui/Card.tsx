import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm ${
        hover ? 'hover:shadow-md hover:border-slate-200 transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
