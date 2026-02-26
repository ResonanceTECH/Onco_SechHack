import { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import { detectPII } from '../../utils/detectPII';

const PII_HINT = 'Вводите только медицинские параметры. Не указывайте ФИО, телефон, email, адрес, полис и т.д.';

interface StepTextInputProps {
  placeholder: string;
  onSubmit: (text: string) => void;
}

export function StepTextInput({ placeholder, onSubmit }: StepTextInputProps) {
  const [value, setValue] = useState('');
  const [piiWarning, setPiiWarning] = useState(false);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (detectPII(trimmed)) {
      setPiiWarning(true);
      return;
    }
    setPiiWarning(false);
    onSubmit(trimmed);
    setValue('');
  }, [value, onSubmit]);

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
      <p className="text-xs text-slate-500">{PII_HINT}</p>
      {piiWarning && (
        <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
          Обнаружен возможный ввод персональных данных. Удалите их.
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setPiiWarning(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          Отправить
        </button>
      </div>
    </div>
  );
}
