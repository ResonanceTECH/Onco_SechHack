import { useEffect, useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useLayoutStore } from '../../stores/layoutStore';
import { mockCreateChat, mockGetMissingFields } from '../../api/mock';
import { api, USE_REAL_API } from '../../api/http';
import { mockStartVerification, mockGetPipelineProgress } from '../../api/mock/pipeline';
import { mockGetReport } from '../../api/mock/reports';
import type { CaseDraft, Step0Data, Step1Data, Step2Data, Step3Data, Step4Data } from '../../types';
import { ChatThread } from '../../components/chat/ChatThread';
import { Composer } from '../../components/chat/Composer';
import { EmptyState } from '../../components/platform-ui/EmptyState';
import { Step2Analyses } from '../../components/wizard/Step2Analyses';
import { Step3Prescriptions } from '../../components/wizard/Step3Prescriptions';
import { Step4Sources } from '../../components/wizard/Step4Sources';
import { Step5Confirm } from '../../components/wizard/Step5Confirm';
import { StepInputChoice, type StepInputMode } from '../../components/wizard/StepInputChoice';
import { ProgressStages } from '../../components/report/ProgressStages';

const WELCOME_ASSISTANT = {
  id: 'welcome',
  role: 'assistant' as const,
  blocks: [{
    type: 'step_prompt' as const,
    text: 'Выберите тип ввода данных: шаблон (по полям) или текстом. Если начнёте вводить текст в чат — автоматически выберется ввод текстом.',
  }],
  createdAt: new Date().toISOString(),
};

const STEP0_TEMPLATE_HINTS = [
  'Введите ФИО в обезличенном виде (например: Пациент 1). Данные не должны содержать персональную информацию.',
  'Укажите возраст (только число лет, не дату рождения).',
  'Укажите диагноз: рак молочной железы — стадия, подтип, маркеры (ER, PR, HER2, Ki-67) и т.д.',
  'Укажите анамнез заболевания.',
] as const;

function getCurrentStep(draft: CaseDraft | undefined): number {
  const step0Done = draft?.step0 && (
    draft.step0.freeText != null ||
    draft.step0.nosologyId != null ||
    (['templateFio', 'templateDateOfBirth', 'templateDiagnosis', 'templateAnamnesis'] as const).every(
      (k) => draft!.step0![k] != null && String(draft!.step0![k]).trim() !== ''
    )
  );
  if (!step0Done) return 0;
  const step1Done = draft?.step1 && (draft.step1.freeText != null || draft.step1.localization != null || draft.step1.morphology != null);
  if (!step1Done) return 1;
  if (!draft?.step2) return 2;
  if (!draft?.step3) return 3;
  if (!draft?.step4) return 4;
  return 5;
}

export function ChatsPage() {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    setCreatingGroup,
    addChat,
    addGroup,
    updateChat,
    setMessages,
    appendMessage,
    setDraft,
    getDraft,
    setReport,
    messagesByChatId,
    creatingGroup,
    hydrateFromStorage,
  } = useChatStore();

  const [piiScanPassed, setPiiScanPassed] = useState<boolean | null>(null);
  const [pipelineStages, setPipelineStages] = useState<{ name: string; label: string; status: string }[] | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [stepInputMode, setStepInputMode] = useState<StepInputMode | null>(null);
  const middlePanelOpen = useLayoutStore((s) => s.middlePanelOpen);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  // Сброс выбора способа ввода при смене чата (в каждом диалоге выбор делается один раз в начале)
  useEffect(() => {
    setStepInputMode(null);
  }, [activeChatId]);

  const messages = activeChatId ? messagesByChatId[activeChatId] ?? [] : [];
  const activeChat = activeChatId ? chats.find((c: { id: string }) => c.id === activeChatId) : null;
  const draft = activeChatId ? getDraft(activeChatId) : undefined;
  const currentStep = getCurrentStep(draft);

  const addUserSummary = (chatId: string, text: string) => {
    appendMessage(chatId, {
      id: `user-${Date.now()}`,
      role: 'user',
      blocks: [{ type: 'step_summary', text }],
      createdAt: new Date().toISOString(),
    });
  };

  const addAssistantPrompt = (chatId: string, text: string) => {
    appendMessage(chatId, {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      blocks: [{ type: 'step_prompt', text }],
      createdAt: new Date().toISOString(),
    });
  };

  const handleNewCheck = async () => {
    let chat;
    if (USE_REAL_API) {
      try {
        const raw = await api.createCase({
          name: 'Новая проверка',
          price: 0,
          is_active: true,
          description: 'Кейс, созданный из интерфейса ОнкоПротокол+',
        });
        const created = (raw as any).data ?? raw;
        chat = {
          id: `case-${created.id}`,
          backendId: created.id,
          title: created.name ?? 'Новая проверка',
          status: 'draft' as const,
          updatedAt: new Date().toISOString(),
        };
      } catch (e) {
        console.error('Failed to create backend case, falling back to mock', e);
        chat = await mockCreateChat('Новая проверка');
      }
    } else {
      chat = await mockCreateChat('Новая проверка');
    }
    addChat(chat);
    setActiveChatId(chat.id);
    setMessages(chat.id, [WELCOME_ASSISTANT]);
  };

  const handleStep0 = (data: Step0Data) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step0: data });
    updateChat(activeChatId, { title: data.templateDiagnosis ?? data.nosologyName ?? 'Новая проверка', status: 'wizard' });
    const summary = data.templateDiagnosis
      ? [data.templateFio, data.templateDateOfBirth, data.templateDiagnosis, data.templateAnamnesis].filter(Boolean).join(' · ') || 'Шаблон заполнен'
      : `Нозология: ${data.nosologyName}, цель: ${data.clinicalGoal}`;
    addUserSummary(activeChatId, summary);
    addAssistantPrompt(activeChatId, 'Укажите анализы и исследования: лабораторные, КТ/МРТ/ПЭТ-КТ/биопсия, молекулярные маркеры.');
  };

  const handleStep1 = (data: Step1Data) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step1: data });
    const summary = data.freeText ?? `Диагноз: ${data.localization ?? ''}, ${data.morphology ?? ''}, стадия ${data.stage ?? ''}, ECOG ${data.ecog ?? ''}`;
    addUserSummary(activeChatId, summary);
    addAssistantPrompt(activeChatId, 'Укажите анализы и исследования: лабораторные, КТ/МРТ/ПЭТ-КТ/биопсия, молекулярные маркеры.');
  };

  const handleStep2 = (data: Step2Data) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step2: data });
    addUserSummary(activeChatId, 'Анализы и исследования заполнены.');
    addAssistantPrompt(activeChatId, 'Заполните назначения: препараты, дозы, режим, G-CSF, антиэметики, ограничения.');
  };

  const handleStep3 = (data: Step3Data) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step3: data });
    addUserSummary(activeChatId, 'Назначения заполнены.');
    addAssistantPrompt(activeChatId, 'Выберите источники проверки: РФ КР, NCCN, ESMO, версия.');
  };

  const handleStep4 = (data: Step4Data) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step4: data });
    addUserSummary(activeChatId, `Источники: РФ ${data.useRF ? 'да' : 'нет'}, NCCN ${data.useNCCN ? 'да' : 'нет'}, ESMO ${data.useESMO ? 'да' : 'нет'}, ${data.versionLabel ?? ''}.`);
    addAssistantPrompt(activeChatId, 'Подтвердите обезличивание и запустите проверку.');
  };

  const handleStep1Text = (text: string) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step1: { freeText: text } });
    addUserSummary(activeChatId, text);
    addAssistantPrompt(activeChatId, 'Укажите анализы и исследования: лабораторные, КТ/МРТ/ПЭТ-КТ/биопсия, молекулярные маркеры.');
  };

  const handleStep2Text = (text: string) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step2: { freeText: text } });
    addUserSummary(activeChatId, text);
    addAssistantPrompt(activeChatId, 'Заполните назначения: препараты, дозы, режим, G-CSF, антиэметики, ограничения.');
  };

  const handleStep3Text = (text: string) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step3: { freeText: text } });
    addUserSummary(activeChatId, text);
    addAssistantPrompt(activeChatId, 'Выберите источники проверки: РФ КР, NCCN, ESMO, версия.');
  };

  const handleStep4Text = (text: string) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step4: { freeText: text } });
    addUserSummary(activeChatId, text);
    addAssistantPrompt(activeChatId, 'Подтвердите обезличивание и запустите проверку.');
  };

  const handleStep0Text = (text: string) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step0: { freeText: text } });
    updateChat(activeChatId, { title: 'Новая проверка', status: 'wizard' });
    addUserSummary(activeChatId, text);
    addAssistantPrompt(activeChatId, 'Заполните шаг «Диагноз»: локализация, морфология, стадия, TNM, метастазы, ECOG, коморбидности.');
  };

  const handleLaunch = async () => {
    if (!activeChatId) return;
    setVerifying(true);
    setPipelineStages(null);
    const stages = await mockStartVerification(activeChatId);
    setPipelineStages(stages);
    updateChat(activeChatId, { status: 'verifying' });
    appendMessage(activeChatId, {
      id: `prog-${Date.now()}`,
      role: 'assistant',
      blocks: [{ type: 'progress', payload: stages }],
      createdAt: new Date().toISOString(),
    });
    // Mock: after 2s set done and fetch report
    setTimeout(async () => {
      const progress = await mockGetPipelineProgress(activeChatId);
      setPipelineStages(progress.stages);
      if (progress.done) {
        const report = await mockGetReport(activeChatId);
        if (report) setReport(activeChatId, report);
        updateChat(activeChatId, { status: 'done' });
        appendMessage(activeChatId, {
          id: `rep-${Date.now()}`,
          role: 'assistant',
          blocks: [
            { type: 'text', text: `Проверка завершена. Статус: ${report?.status ?? 'готово'}.` },
            { type: 'report_cards', payload: report?.summaryCards ?? [] },
          ],
          createdAt: new Date().toISOString(),
        });
      }
      setVerifying(false);
    }, 2500);
  };

  const handleCheckCompleteness = async () => {
    if (!activeChatId) return;
    const missing = await mockGetMissingFields(activeChatId);
    if (missing.length) {
      addAssistantPrompt(activeChatId, `Не заполнено: ${missing.join(', ')}. (мок)`);
    } else {
      addAssistantPrompt(activeChatId, 'Все обязательные поля заполнены. (мок)');
    }
  };

  const handleComposerSubmit = (text: string) => {
    if (!activeChatId) return;

    const latestDraft = getDraft(activeChatId);

    // Шаг 0: если тип ввода ещё не выбран и пользователь отправил текст — автоматически выбираем ввод текстом
    if (showWizard && currentStep === 0 && stepInputMode === null) {
      setStepInputMode('text');
      handleStep0Text(text);
      return;
    }

    // Шаг 0, шаблон: подсказки в чате (ФИО → возраст → диагноз → анамнез)
    if (showWizard && currentStep === 0 && stepInputMode === 'form') {
      const step0 = latestDraft?.step0 ?? {};
      const keys: (keyof Step0Data)[] = ['templateFio', 'templateDateOfBirth', 'templateDiagnosis', 'templateAnamnesis'];
      const idx = keys.findIndex((k) => !step0[k] || String(step0[k]).trim() === '');
      if (idx < 0) {
        handleStep0({ ...step0 } as Step0Data);
        return;
      }
      const next: Step0Data = { ...step0, [keys[idx]]: text.trim() };
      setDraft(activeChatId, { ...latestDraft, step0: next });
      addUserSummary(activeChatId, text.trim());
      if (idx < 3) {
        addAssistantPrompt(activeChatId, STEP0_TEMPLATE_HINTS[idx + 1]);
      } else {
        handleStep0(next);
      }
      return;
    }

    // Шаг 0 текстом
    if (showWizard && currentStep === 0 && stepInputMode === 'text') {
      handleStep0Text(text);
      return;
    }

    // Шаги 1–4: только текстом (шаблон только для шага 0 — ФИО, возраст, диагноз, анамнез)
    if (showWizard && currentStep >= 1 && currentStep <= 4 && (stepInputMode === 'text' || stepInputMode === 'form')) {
      if (currentStep === 1) {
        handleStep1Text(text);
        return;
      }
      if (currentStep === 2) {
        handleStep2Text(text);
        return;
      }
      if (currentStep === 3) {
        handleStep3Text(text);
        return;
      }
      if (currentStep === 4) {
        handleStep4Text(text);
        return;
      }
    }

    // Обычное сообщение чата (в шагах 0–4 с выбранным способом ввода не показываем «Принято.»)
    appendMessage(activeChatId, {
      id: `user-${Date.now()}`,
      role: 'user',
      blocks: [{ type: 'text', text }],
      createdAt: new Date().toISOString(),
    });
    if (!(showWizard && currentStep <= 4 && stepInputMode !== null)) {
      setTimeout(() => {
        appendMessage(activeChatId, {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          blocks: [{ type: 'text', text: 'Принято.' }],
          createdAt: new Date().toISOString(),
        });
      }, 300);
    }
  };

  if (chats.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50">
        <EmptyState title="Нет кейсов" description="Создайте новую проверку, чтобы начать заполнение протокола по шагам." />
        <button type="button" onClick={handleNewCheck} className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500">
          Новая проверка
        </button>
      </div>
    );
  }

  if (!activeChatId && !creatingGroup) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50">
        <EmptyState title="Выберите кейс" description="Выберите кейс в списке слева или создайте новую проверку." />
      </div>
    );
  }

  const showWizard = (activeChat?.status === 'draft' || activeChat?.status === 'wizard') && currentStep <= 5 && !verifying;

  const step0TemplateIndex = draft?.step0
    ? (['templateFio', 'templateDateOfBirth', 'templateDiagnosis', 'templateAnamnesis'] as const).findIndex(
        (k) => !draft!.step0![k] || String(draft!.step0![k]).trim() === ''
      )
    : 0;
  const step0TemplatePlaceholder = step0TemplateIndex >= 0 && step0TemplateIndex < 4 ? STEP0_TEMPLATE_HINTS[step0TemplateIndex] : '';

  const isNewGroupMode = creatingGroup;

  const composerHint =
    showWizard && currentStep === 0 && stepInputMode === 'form'
      ? (step0TemplatePlaceholder || STEP0_TEMPLATE_HINTS[0])
      : undefined;
  const composerPlaceholder =
    showWizard && currentStep === 0 && stepInputMode === 'form'
      ? step0TemplatePlaceholder || STEP0_TEMPLATE_HINTS[0]
      : showWizard && currentStep === 0 && stepInputMode === 'text'
      ? 'Вставьте или напишите полный текст (ФИО, дата рождения, диагноз, анамнез и др.). Система распознает, к каким пунктам относятся данные.'
      : showWizard && currentStep === 1 && (stepInputMode === 'text' || stepInputMode === 'form')
        ? 'Опишите диагноз: рак молочной железы — стадия, подтип, маркеры (ER, PR, HER2), метастазы, ECOG, коморбидности. Только медицинские параметры.'
        : showWizard && currentStep === 2 && (stepInputMode === 'text' || stepInputMode === 'form')
          ? 'Анализы и исследования: лабораторные, КТ/МРТ/ПЭТ-КТ/биопсия, молекулярные маркеры. Только медицинские параметры.'
          : showWizard && currentStep === 3 && (stepInputMode === 'text' || stepInputMode === 'form')
            ? 'Назначения: препараты, дозы, режим, циклы, линия терапии, G-CSF, антиэметики, ограничения. Только медицинские параметры.'
            : showWizard && currentStep === 4 && (stepInputMode === 'text' || stepInputMode === 'form')
              ? 'Источники проверки: какие гайды использовать (РФ КР, NCCN, ESMO), версия. Только медицинские параметры.'
              : 'Сообщение…';

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {creatingGroup && !activeChatId ? (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <p className="text-slate-600 text-center">Укажите название новой группы в строке ввода ниже.</p>
          </div>
        ) : (
          <>
        <ChatThread messages={messages} />
        {pipelineStages && (
          <div className="max-w-3xl mx-auto px-4 pb-4">
            <ProgressStages stages={pipelineStages} />
          </div>
        )}
        {showWizard && middlePanelOpen && (
          <div className="max-w-2xl mx-auto px-4 pb-4 space-y-4">
            {currentStep === 2 && stepInputMode === 'form' && (
              <Step2Analyses defaultValues={draft?.step2} onSubmit={handleStep2} onCheckCompleteness={handleCheckCompleteness} />
            )}
            {currentStep === 3 && stepInputMode === 'form' && (
              <Step3Prescriptions defaultValues={draft?.step3} onSubmit={handleStep3} />
            )}
            {currentStep === 4 && stepInputMode === 'form' && (
              <Step4Sources defaultValues={draft?.step4} onSubmit={handleStep4} />
            )}
            {currentStep === 5 && (
              <Step5Confirm onLaunch={handleLaunch} piiScanPassed={piiScanPassed !== false} onPiiScanPassedChange={(v) => setPiiScanPassed(v)} />
            )}
          </div>
        )}
          </>
        )}
      </div>
      {showWizard && middlePanelOpen && currentStep === 0 && stepInputMode === null && !isNewGroupMode && (
        <div className="bg-white px-4 pt-3 pb-3">
          <StepInputChoice
            onChoose={(mode) => {
              setStepInputMode(mode);
              if (mode === 'form' && activeChatId) {
                const hasAny = messages.some(
                  (m) => m.role === 'assistant' && m.blocks.some((b) => b.text && (STEP0_TEMPLATE_HINTS as readonly string[]).includes(b.text))
                );
                if (!hasAny) addAssistantPrompt(activeChatId, STEP0_TEMPLATE_HINTS[0]);
              }
            }}
          />
        </div>
      )}
      {isNewGroupMode ? (
        <Composer
          mode="newGroup"
          initialValue=""
          placeholder="Название группы"
          onSubmit={(name) => {
            if (name.trim()) {
              addGroup(name.trim());
              setCreatingGroup(false);
            }
          }}
          onCancel={() => setCreatingGroup(false)}
          disabled={false}
        />
      ) : (
        <Composer onSubmit={handleComposerSubmit} placeholder={composerPlaceholder} hint={composerHint} disabled={false} />
      )}
    </div>
  );
}
