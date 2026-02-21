interface Step {
  key: string;
  label: string;
  done?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentIndex?: number;
}

export function Stepper({ steps, currentIndex = 0 }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${i < currentIndex || s.done ? 'bg-emerald-500 text-white' : i === currentIndex ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}
            `}
          >
            {i < currentIndex || s.done ? '✓' : i + 1}
          </div>
          <span className="ml-2 text-sm text-slate-600">{s.label}</span>
          {i < steps.length - 1 && <span className="mx-2 w-6 h-0.5 bg-slate-200" />}
        </div>
      ))}
    </div>
  );
}
