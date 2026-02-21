import { useState } from 'react';
import type { Issue } from '../../types';
import { SEVERITY_LABELS } from '../../types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DeviationForm } from './DeviationForm';

interface IssuesAccordionProps {
  issues: Issue[];
  onAcceptDeviation?: (issueId: string, reasonId: string, comment: string) => void;
}

const severityColor: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  major: 'bg-amber-100 text-amber-800 border-amber-200',
  minor: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function IssuesAccordion({ issues, onAcceptDeviation }: IssuesAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (issues.length === 0) {
    return <p className="text-sm text-slate-500">Нет замечаний.</p>;
  }

  return (
    <div className="space-y-1">
      {issues.map((issue) => {
        const isOpen = openId === issue.id;
        return (
          <div key={issue.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : issue.id)}
              className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-50"
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium border ${severityColor[issue.severity] ?? severityColor.minor}`}>
                {SEVERITY_LABELS[issue.severity]}
              </span>
              <span className="flex-1 truncate text-sm text-slate-700">{issue.description}</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-0 border-t border-slate-100 space-y-2">
                <p className="text-sm text-slate-600">{issue.description}</p>
                {issue.guidelineQuote && (
                  <p className="text-sm text-slate-500 italic">Гайд: {issue.guidelineQuote}</p>
                )}
                {issue.guidelineRef && (
                  <p className="text-xs text-slate-500">
                    {issue.guidelineRef.guidelineVersion}, {issue.guidelineRef.sectionLabel}
                  </p>
                )}
                {issue.missingData?.length ? (
                  <p className="text-xs text-amber-700">Не хватает: {issue.missingData.join(', ')}</p>
                ) : null}
                {!issue.acceptedDeviation && onAcceptDeviation && (
                  <DeviationForm
                    issueId={issue.id}
                    onSubmit={(reasonId, comment) => onAcceptDeviation(issue.id, reasonId, comment)}
                  />
                )}
                {issue.acceptedDeviation && (
                  <p className="text-xs text-slate-500">Отклонение принято.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
