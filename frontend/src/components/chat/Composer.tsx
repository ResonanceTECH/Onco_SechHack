import { useState, useCallback, useEffect, useRef } from 'react';
import { Send, Check, X } from 'lucide-react';
import { detectPII } from '../../utils/detectPII';

const PII_HINT = 'Вводите только медицинские параметры. Не указывайте ФИО, телефон, email, адрес, дату рождения, полис и т.д.';

export type ComposerMode = 'message' | 'rename' | 'newGroup';

interface ComposerProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  /** Подсказка над полем ввода (если задана — показывается вместо общей PII-подсказки, должна совпадать с подсказкой в чате) */
  hint?: string;
  quickSuggestions?: string[];
  disabled?: boolean;
  /** Режим: сообщение (по умолчанию), переименование чата, название новой группы */
  mode?: ComposerMode;
  /** Начальное значение для режимов rename/newGroup */
  initialValue?: string;
  /** Отмена (для rename/newGroup) */
  onCancel?: () => void;
}

export function Composer({
  onSubmit,
  placeholder = 'Введите сообщение…',
  hint,
  quickSuggestions = [],
  disabled = false,
  mode = 'message',
  initialValue = '',
  onCancel,
}: ComposerProps) {
  const [value, setValue] = useState(initialValue);
  const [piiWarning, setPiiWarning] = useState(false);

  const isInlineMode = mode === 'rename' || mode === 'newGroup';
  const prevModeRef = useRef(mode);
  useEffect(() => {
    if (isInlineMode) {
      setValue(initialValue);
    } else if (prevModeRef.current !== 'message') {
      setValue('');
    }
    prevModeRef.current = mode;
  }, [mode, isInlineMode, initialValue]);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    if (mode === 'message' && detectPII(trimmed)) {
      setPiiWarning(true);
      return;
    }
    setPiiWarning(false);
    onSubmit(trimmed);
    if (mode === 'message') setValue('');
  }, [value, disabled, onSubmit, mode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (isInlineMode && e.key === 'Escape') {
      e.preventDefault();
      onCancel?.();
    }
  };

  const label =
    mode === 'rename' ? 'Название кейса' : mode === 'newGroup' ? 'Название группы' : null;
  const submitLabel = mode === 'rename' ? 'Сохранить' : mode === 'newGroup' ? 'Создать' : null;

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      {mode === 'message' && (
        <p className="text-xs text-slate-500 mb-2">{hint ?? PII_HINT}</p>
      )}
      {mode === 'message' && piiWarning && (
        <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mb-2">
          Обнаружен возможный ввод персональных данных. Удалите их и оставьте только медицинские параметры.
        </p>
      )}
      {label && (
        <label htmlFor="composer-inline-input" className="block text-sm font-medium text-slate-600 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex gap-2 items-center">
        <textarea
          id="composer-inline-input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setPiiWarning(false);
          }}
          onBlur={() => setPiiWarning(false)}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'rename' ? 'Введите название кейса' : mode === 'newGroup' ? 'Введите название группы' : placeholder}
          disabled={disabled}
          rows={isInlineMode ? 1 : 2}
          className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
          aria-label={label ?? undefined}
        />
        {isInlineMode ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={disabled || !value.trim()}
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={submitLabel ?? 'Подтвердить'}
              title={submitLabel ?? undefined}
            >
              <Check className="w-5 h-5" />
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Отмена"
                title="Отмена"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            className="shrink-0 p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Отправить"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </div>
      {mode === 'message' && quickSuggestions.length > 0 && (
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
