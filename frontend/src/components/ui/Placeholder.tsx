import { ReactNode } from 'react';

interface PlaceholderProps {
  icon?: ReactNode;
  label?: string;
  aspectRatio?: string;
  className?: string;
}

export function Placeholder({
  icon,
  label = 'Placeholder',
  aspectRatio = 'aspect-video',
  className = '',
}: PlaceholderProps) {
  return (
    <div
      className={`${aspectRatio} rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-3 ${className}`}
    >
      {icon && <div className="text-slate-300">{icon}</div>}
      <span className="text-sm text-slate-400 font-medium">{label}</span>
    </div>
  );
}
