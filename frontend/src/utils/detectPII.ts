/**
 * Client-side heuristic to detect likely PII in free text.
 * UX guardrail only — do not log detected values.
 */

const PATTERNS: RegExp[] = [
  /\b[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+(\s+[А-ЯЁ][а-яё]+)?\b/, // ФИО (2-3 слова с заглавной)
  /\b\d{10}\b/, // телефон 10 цифр
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{2}[-.\s]?\d{2}\b/, // телефон с разделителями
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // email
  /\b\d{4}\s?\d{6}\b/, // паспорт серия номер
  /\b\d{3}-\d{3}-\d{3}\s?\d{2}\b/, // СНИЛС
  /\b\d{16}\b/, // полис (16 цифр)
  /\b(0?[1-9]|[12]\d|3[01])[./](0?[1-9]|1[0-2])[./](19|20)\d{2}\b/, // дата дд.мм.гггг
  /\b(ул\.|улица|пр\.|проспект|д\.|дом|кв\.|квартира)\s*[^\s,]+/i, // адрес
  /\b(Иванов|Петров|Сидоров|Смирнов|Кузнецов)(\s+[А-ЯЁ][а-яё]+)*\b/i, // типичные фамилии
];

const PII_HINT = /(пациент|больной|ф\.и\.о|фио|фамилия|имя|телефон|email|почта|адрес|полис|паспорт|снилс|дата\s+рождения)/i;

export function detectPII(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length < 3) return false;

  for (const re of PATTERNS) {
    if (re.test(normalized)) return true;
  }
  if (PII_HINT.test(normalized)) return true;
  return false;
}
