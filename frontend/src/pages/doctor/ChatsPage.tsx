import { useEffect, useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { mockCreateChat, mockGetMissingFields } from '../../api/mock';
import { mockStartVerification, mockGetPipelineProgress } from '../../api/mock/pipeline';
import { mockGetReport } from '../../api/mock/reports';
import type { CaseDraft, Step0Data, Step1Data, Step2Data, Step3Data, Step4Data } from '../../types';
import { ChatThread } from '../../components/chat/ChatThread';
import { Composer } from '../../components/chat/Composer';
import { EmptyState } from '../../components/platform-ui/EmptyState';
import { Step0Nosology } from '../../components/wizard/Step0Nosology';
import { Step1Diagnosis } from '../../components/wizard/Step1Diagnosis';
import { Step2Analyses } from '../../components/wizard/Step2Analyses';
import { Step3Prescriptions } from '../../components/wizard/Step3Prescriptions';
import { Step4Sources } from '../../components/wizard/Step4Sources';
import { Step5Confirm } from '../../components/wizard/Step5Confirm';
import { ProgressStages } from '../../components/report/ProgressStages';

const WELCOME_ASSISTANT = {
  id: 'welcome',
  role: 'assistant' as const,
  blocks: [{ type: 'step_prompt' as const, text: 'Выберите нозологию и клиническую цель. После этого перейдём к шагу «Диагноз».' }],
  createdAt: new Date().toISOString(),
};

function getCurrentStep(draft: CaseDraft | undefined): number {
  if (!draft?.step0) return 0;
  if (!draft?.step1) return 1;
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
    addChat,
    updateChat,
    setMessages,
    appendMessage,
    setDraft,
    getDraft,
    setReport,
    messagesByChatId,
    hydrateFromStorage,
  } = useChatStore();

  const [piiScanPassed, setPiiScanPassed] = useState<boolean | null>(null);
  const [pipelineStages, setPipelineStages] = useState<{ name: string; label: string; status: string }[] | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

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
    const chat = await mockCreateChat('Новая проверка');
    addChat(chat);
    setActiveChatId(chat.id);
    setMessages(chat.id, [WELCOME_ASSISTANT]);
  };

  const handleStep0 = (data: Step0Data) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step0: data });
    updateChat(activeChatId, { title: `${data.nosologyName}`, nosology: data.nosologyName, status: 'wizard' });
    addUserSummary(activeChatId, `Нозология: ${data.nosologyName}, цель: ${data.clinicalGoal}`);
    addAssistantPrompt(activeChatId, 'Заполните шаг «Диагноз»: локализация, морфология, стадия, TNM, метастазы, ECOG, коморбидности.');
  };

  const handleStep1 = (data: Step1Data) => {
    if (!activeChatId) return;
    setDraft(activeChatId, { ...draft, step1: data });
    addUserSummary(activeChatId, `Диагноз: ${data.localization}, ${data.morphology}, стадия ${data.stage}, ECOG ${data.ecog}`);
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
    addUserSummary(activeChatId, `Источники: РФ ${data.useRF ? 'да' : 'нет'}, NCCN ${data.useNCCN ? 'да' : 'нет'}, ESMO ${data.useESMO ? 'да' : 'нет'}, ${data.versionLabel}.`);
    addAssistantPrompt(activeChatId, 'Подтвердите обезличивание и запустите проверку.');
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
    appendMessage(activeChatId, {
      id: `user-${Date.now()}`,
      role: 'user',
      blocks: [{ type: 'text', text }],
      createdAt: new Date().toISOString(),
    });
    setTimeout(() => {
      appendMessage(activeChatId, {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        blocks: [{ type: 'text', text: 'Принято.' }],
        createdAt: new Date().toISOString(),
      });
    }, 300);
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

  if (!activeChatId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50">
        <EmptyState title="Выберите кейс" description="Выберите кейс в списке слева или создайте новую проверку." />
      </div>
    );
  }

  const showWizard = (activeChat?.status === 'draft' || activeChat?.status === 'wizard') && currentStep <= 5 && !verifying;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ChatThread messages={messages} />
        {pipelineStages && (
          <div className="max-w-3xl mx-auto px-4 pb-4">
            <ProgressStages stages={pipelineStages} />
          </div>
        )}
        {showWizard && (
          <div className="max-w-2xl mx-auto px-4 pb-4">
            {currentStep === 0 && <Step0Nosology defaultValues={draft?.step0} onSubmit={handleStep0} />}
            {currentStep === 1 && <Step1Diagnosis defaultValues={draft?.step1} onSubmit={handleStep1} />}
            {currentStep === 2 && (
              <Step2Analyses defaultValues={draft?.step2} onSubmit={handleStep2} onCheckCompleteness={handleCheckCompleteness} />
            )}
            {currentStep === 3 && <Step3Prescriptions defaultValues={draft?.step3} onSubmit={handleStep3} />}
            {currentStep === 4 && <Step4Sources defaultValues={draft?.step4} onSubmit={handleStep4} />}
            {currentStep === 5 && (
              <Step5Confirm onLaunch={handleLaunch} piiScanPassed={piiScanPassed !== false} onPiiScanPassedChange={(v) => setPiiScanPassed(v)} />
            )}
          </div>
        )}
      </div>
      <Composer onSubmit={handleComposerSubmit} placeholder="Сообщение…" disabled={false} />
    </div>
  );
}
