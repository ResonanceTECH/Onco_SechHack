import { useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { detectPII } from '../../utils/detectPII';

interface Step5ConfirmProps {
  onLaunch: () => void;
  piiScanPassed: boolean;
  onPiiScanPassedChange: (v: boolean) => void;
}

export function Step5Confirm({ onLaunch, piiScanPassed, onPiiScanPassedChange }: Step5ConfirmProps) {
  const [piiConfirmed, setPiiConfirmed] = useState(false);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const getDraft = useChatStore((s) => s.getDraft);
  const draft = activeChatId ? getDraft(activeChatId) : undefined;

  const runPiiScan = () => {
    const freeTexts: string[] = [];
    if (draft?.step1) {
      freeTexts.push(
        draft.step1.localization,
        draft.step1.morphology,
        draft.step1.metastasesLocations ?? ''
      );
    }
    if (draft?.step3?.allergiesOrLimits) freeTexts.push(draft.step3.allergiesOrLimits);
    const combined = freeTexts.filter(Boolean).join(' ');
    const hasPii = detectPII(combined);
    onPiiScanPassedChange(!hasPii);
  };

  const canLaunch = piiConfirmed && piiScanPassed;

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-sm text-slate-600">
        Перед запуском проверки подтвердите, что в данных нет персональных данных (ФИО, телефон, email, адрес, полис и т.д.).
      </p>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="pii-confirm"
          checked={piiConfirmed}
          onChange={(e) => setPiiConfirmed(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="pii-confirm" className="text-sm text-slate-700">
          В данных нет персональных данных
        </label>
      </div>
      <div>
        <button
          type="button"
          onClick={runPiiScan}
          className="text-sm text-blue-600 hover:underline"
        >
          Автоскан свободных полей
        </button>
        {piiScanPassed === false && (
          <p className="mt-1 text-sm text-amber-700">Обнаружен возможный ввод ПД. Удалите его перед запуском.</p>
        )}
        {piiScanPassed === true && (
          <p className="mt-1 text-sm text-emerald-600">Скан не выявил явных ПД.</p>
        )}
      </div>
      <button
        type="button"
        onClick={onLaunch}
        disabled={!canLaunch}
        className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Запустить проверку
      </button>
    </div>
  );
}
