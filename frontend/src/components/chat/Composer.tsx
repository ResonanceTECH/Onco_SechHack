import { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import { detectPII } from '../../utils/detectPII';

const PII_HINT = 'Вводите только медицинские параметры. Не указывайте ФИО, телефон, email, адрес, дату рождения, полис и т.д.';

interface ComposerProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  quickSuggestions?: string[];
  disabled?: boolean;
}

export function Composer({
  onSubmit,
  placeholder = 'Введите сообщение…',
  quickSuggestions = [],
  disabled = false,
}: ComposerProps) {
  const [value, setValue] = useState('');
  const [piiWarning, setPiiWarning] = useState(false);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    if (detectPII(trimmed)) {
      setPiiWarning(true);
      return;
    }
    setPiiWarning(false);
    onSubmit(trimmed);
    setValue('');
  }, [value, disabled, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500 mb-2">{PII_HINT}</p>
      {piiWarning && (
        <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mb-2">
          Обнаружен возможный ввод персональных данных. Удалите их и оставьте только медицинские параметры.
        </p>
      )}
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setPiiWarning(false);
          }}
          onBlur={() => setPiiWarning(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="shrink-0 p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Отправить"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      {quickSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {quickSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setValue(s);
                setPiiWarning(false);
              }}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
