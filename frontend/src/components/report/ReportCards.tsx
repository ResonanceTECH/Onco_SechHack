import type { ReportSummaryCard } from '../../types';
import { REPORT_STATUS_LABELS } from '../../types';
import type { ReportStatus } from '../../types';

interface ReportCardsProps {
  status: ReportStatus;
  summaryCards: ReportSummaryCard[];
}

export function ReportCards({ status, summaryCards }: ReportCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600">Итог:</span>
        <span
          className={`
            px-2 py-0.5 rounded text-sm font-medium
            ${status === 'conforms' ? 'bg-emerald-100 text-emerald-800' : ''}
            ${status === 'partial' ? 'bg-amber-100 text-amber-800' : ''}
            ${status === 'non_conforms' ? 'bg-red-100 text-red-800' : ''}
            ${status === 'insufficient_data' ? 'bg-slate-100 text-slate-700' : ''}
          `}
        >
          {REPORT_STATUS_LABELS[status]}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-0">
        {summaryCards.map((c) => (
          <div key={c.type} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm min-w-0 flex items-center justify-between gap-2">
            <span className="font-medium text-slate-700 truncate">{c.label}</span>
            <span className="shrink-0 text-slate-500">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
