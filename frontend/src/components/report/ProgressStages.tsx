interface Stage {
  name: string;
  label: string;
  status: string;
}

interface ProgressStagesProps {
  stages: Stage[];
}

const statusColors: Record<string, string> = {
  queued: 'bg-slate-200 text-slate-500',
  processing: 'bg-amber-100 text-amber-800 border-amber-300',
  done: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  failed: 'bg-red-100 text-red-800 border-red-300',
};

export function ProgressStages({ stages }: ProgressStagesProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-medium text-slate-700 mb-3">Ход проверки</h4>
      <div className="space-y-2">
        {stages.map((s) => (
          <div
            key={s.name}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${statusColors[s.status] ?? statusColors.queued}`}
          >
            {s.status === 'done' && <span className="text-emerald-600">✓</span>}
            {s.status === 'processing' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
            <span className="text-sm font-medium">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
