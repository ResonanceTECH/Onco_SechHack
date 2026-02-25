import { ClipboardList, MessageSquare } from 'lucide-react';

export type StepInputMode = 'form' | 'text';

interface StepInputChoiceProps {
  onChoose: (mode: StepInputMode) => void;
}

export function StepInputChoice({ onChoose }: StepInputChoiceProps) {
  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={() => onChoose('form')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 hover:border-slate-300 transition-colors"
      >
        <ClipboardList className="w-4 h-4 text-slate-500 shrink-0" />
        Использовать шаблон
      </button>
      <button
        type="button"
        onClick={() => onChoose('text')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 hover:border-slate-300 transition-colors"
      >
        <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
        Текстом
      </button>
    </div>
  );
}
