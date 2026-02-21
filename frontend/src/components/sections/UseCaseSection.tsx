import { CheckCircle, AlertCircle } from 'lucide-react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Badge } from '../ui/Badge';
import { FadeIn } from '../ui/FadeIn';

export function UseCaseSection() {
  return (
    <Section id="use-case">
      <Container>
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="amber">Сценарий</Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              Пример использования
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Как ОнкоПротокол+ помогает выявить пропущенное обследование до начала терапии
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mb-4">
                  1
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Врач вводит план</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Онколог вводит параметры: диагноз РМЖ, стадия IIB, назначена схема AC-T.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 font-mono">
                    Диагноз: C50.4
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 font-mono">
                    Стадия: IIB (T2N1M0)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 font-mono">
                    Схема: AC-T
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold mb-4">
                  2
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">AI выявляет пропуск</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Система обнаруживает отсутствие обязательного обследования перед началом терапии.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-amber-700 font-medium">
                        ЭхоКГ не назначена перед антрациклинами
                      </span>
                      <p className="text-[11px] text-amber-600/70 mt-1">КР МЗ РФ, п. 3.4.2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold mb-4">
                  3
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Врач корректирует</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Онколог добавляет ЭхоКГ в план. Повторная проверка — все пункты пройдены.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2.5 bg-emerald-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-700 font-medium">
                      Все проверки пройдены
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 bg-emerald-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-700 font-medium">
                      ЭхоКГ добавлена в план
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Система помогла выявить пропущенное обследование до начала терапии
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
