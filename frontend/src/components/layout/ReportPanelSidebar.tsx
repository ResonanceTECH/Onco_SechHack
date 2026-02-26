import { useEffect, useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { mockGetReport, mockExportPdf } from '../../api/mock';
import { ReportCards } from '../report/ReportCards';
import { IssuesAccordion } from '../report/IssuesAccordion';
import { useLayoutStore } from '../../stores/layoutStore';
import { X, Download, FileText } from 'lucide-react';
import type { Issue, Report } from '../../types';

export function ReportPanelSidebar() {
  const activeChatId = useChatStore((s) => s.activeChatId);
  const getReport = useChatStore((s) => s.getReport);
  const setReport = useChatStore((s) => s.setReport);
  const toggleRightPanel = useLayoutStore((s) => s.toggleRightPanel);
  const [report, setReportLocal] = useState<Report | undefined>(undefined);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!activeChatId) {
      setReportLocal(undefined);
      return;
    }
    const r = getReport(activeChatId);
    if (r) setReportLocal(r);
    else
      mockGetReport(activeChatId).then((data) => {
        if (data) {
          setReport(activeChatId, data);
          setReportLocal(data);
        } else setReportLocal(undefined);
      });
  }, [activeChatId, getReport, setReport]);

  const handleAcceptDeviation = (issueId: string, reasonId: string, comment: string) => {
    if (!report || !activeChatId) return;
    const issues: Issue[] = report.issues.map((i) =>
      i.id === issueId ? { ...i, acceptedDeviation: true, deviationReasonId: reasonId, deviationComment: comment } : i
    );
    setReport(activeChatId, { ...report, issues });
    setReportLocal({ ...report, issues });
  };

  const handleExportPdf = async () => {
    if (!activeChatId) return;
    setExporting(true);
    try {
      const url = await mockExportPdf(activeChatId);
      window.open(url, '_blank');
    } finally {
      setExporting(false);
    }
  };

  return (
    <aside className="w-96 shrink-0 flex flex-col border-l border-slate-200 bg-white overflow-hidden min-h-0">
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <span className="font-medium text-slate-800">Отчёт</span>
        <button
          type="button"
          onClick={toggleRightPanel}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Закрыть панель отчёта"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {activeChatId && report && (
        <div className="shrink-0 px-4 py-3 border-b border-slate-200 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4 shrink-0" />
            PDF
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
          >
            <FileText className="w-4 h-4 shrink-0" />
            Для пациента
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {!activeChatId && <p className="text-sm text-slate-500">Выберите кейс.</p>}
        {activeChatId && !report && <p className="text-sm text-slate-500">Загрузка отчёта…</p>}
        {activeChatId && report && (
          <div className="flex flex-col gap-4 min-w-0">
            <ReportCards status={report.status} summaryCards={report.summaryCards} />
            <div>
              <h2 className="text-sm font-medium text-slate-800 mb-2">Замечания</h2>
              <IssuesAccordion issues={report.issues} onAcceptDeviation={handleAcceptDeviation} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
