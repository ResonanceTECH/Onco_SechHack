import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'white' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  onClick?: () => void;
}

const variants: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md active:shadow-sm',
  secondary: 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  white: 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl',
  outline: 'bg-transparent text-white border border-white/30 hover:bg-white/10',
};

const sizes: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  onClick,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
