import { useParams, Link } from 'react-router-dom';
import { useChatStore } from '../../stores/chatStore';
import { mockGetReport, mockExportPdf, mockGenerateCode } from '../../api/mock';
import { useEffect, useState } from 'react';
import { ReportCards } from '../../components/report/ReportCards';
import { IssuesAccordion } from '../../components/report/IssuesAccordion';
import type { Issue, Report } from '../../types';

export function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const caseId = id ?? '';
  const getReport = useChatStore((s) => s.getReport);
  const setReport = useChatStore((s) => s.setReport);
  const [report, setReportLocal] = useState<Report | undefined>(undefined);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const r = getReport(caseId);
    if (r) setReportLocal(r);
    else mockGetReport(caseId).then((data) => {
      if (data) {
        setReport(caseId, data);
        setReportLocal(data);
      }
    });
  }, [caseId, getReport, setReport]);

  const handleAcceptDeviation = (issueId: string, reasonId: string, comment: string) => {
    if (!report) return;
    const issues: Issue[] = report.issues.map((i) =>
      i.id === issueId ? { ...i, acceptedDeviation: true, deviationReasonId: reasonId, deviationComment: comment } : i
    );
    setReport(caseId, { ...report, issues });
    setReportLocal({ ...report, issues });
  };

  const handleExportPdf = async () => {
    const url = await mockExportPdf(caseId);
    window.open(url, '_blank');
  };

  const handleGenerateCode = async () => {
    const c = await mockGenerateCode(caseId);
    setCode(c);
  };

  if (!report) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-slate-500">Загрузка отчёта…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/doctor/chats" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← К чату
      </Link>
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Отчёт проверки</h1>
      <ReportCards status={report.status} summaryCards={report.summaryCards} />
      <div className="mt-6">
        <h2 className="text-lg font-medium text-slate-800 mb-2">Замечания</h2>
        <IssuesAccordion issues={report.issues} onAcceptDeviation={handleAcceptDeviation} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleExportPdf}
          className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300"
        >
          Экспорт PDF (заглушка)
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300"
        >
          Версия для пациента (заглушка)
        </button>
        <button
          type="button"
          onClick={handleGenerateCode}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500"
        >
          Сгенерировать код
        </button>
      </div>
      {code && (
        <p className="mt-2 text-sm font-mono text-slate-600">Код: {code}</p>
      )}
    </div>
  );
}
