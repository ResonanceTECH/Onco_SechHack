import { useState } from 'react';
import { detectPII } from '../../utils/detectPII';

const DEVIATION_REASONS = [
  { id: 'clinical', label: 'Клиническое обоснование' },
  { id: 'patient', label: 'Индивидуальные особенности (без ПД)' },
  { id: 'data_unavailable', label: 'Данные недоступны' },
  { id: 'other', label: 'Другое' },
];

interface DeviationFormProps {
  issueId: string;
  onSubmit: (reasonId: string, comment: string) => void;
}

export function DeviationForm({ issueId, onSubmit }: DeviationFormProps) {
  const [reasonId, setReasonId] = useState('');
  const [comment, setComment] = useState('');
  const [piiWarn, setPiiWarn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (detectPII(comment)) {
      setPiiWarn(true);
      return;
    }
    setPiiWarn(false);
    onSubmit(reasonId, comment);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
      <p className="text-xs text-slate-500">В комментарии только медицинские параметры, без ПД.</p>
      <select
        value={reasonId}
        onChange={(e) => setReasonId(e.target.value)}
        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded"
        required
      >
        <option value="">— причина отклонения —</option>
        {DEVIATION_REASONS.map((r) => (
          <option key={r.id} value={r.id}>{r.label}</option>
        ))}
      </select>
      <textarea
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          setPiiWarn(false);
        }}
        placeholder="Комментарий (без ПД)"
        rows={2}
        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded"
      />
      {piiWarn && <p className="text-xs text-amber-700">Обнаружен возможный ввод ПД.</p>}
      <button type="submit" className="text-sm px-3 py-1.5 rounded bg-slate-700 text-white hover:bg-slate-600">
        Пометить как принятое отклонение
      </button>
    </form>
  );
}
