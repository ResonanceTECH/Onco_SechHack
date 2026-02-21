import { create } from 'zustand';
import type { ChatCase, Message, CaseDraft, Report } from '../types';
import {
  getChatsFromStorage,
  saveChatsToStorage,
  getMessagesFromStorage,
  saveMessagesToStorage,
  getDraftsFromStorage,
  saveDraftsToStorage,
} from '../api/mock';

interface ChatState {
  chats: ChatCase[];
  activeChatId: string | null;
  messagesByChatId: Record<string, Message[]>;
  draftsByChatId: Record<string, CaseDraft>;
  reportsByChatId: Record<string, Report>;
  setChats: (chats: ChatCase[]) => void;
  setActiveChatId: (id: string | null) => void;
  addChat: (chat: ChatCase) => void;
  updateChat: (id: string, patch: Partial<ChatCase>) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  appendMessage: (chatId: string, message: Message) => void;
  getDraft: (chatId: string) => CaseDraft | undefined;
  setDraft: (chatId: string, draft: CaseDraft) => void;
  setReport: (chatId: string, report: Report) => void;
  getReport: (chatId: string) => Report | undefined;
  hydrateFromStorage: () => void;
  persistToStorage: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,
  messagesByChatId: {},
  draftsByChatId: {},
  reportsByChatId: {},

  setChats: (chats) => set({ chats }),
  setActiveChatId: (activeChatId) => set({ activeChatId }),
  addChat: (chat) =>
    set((s) => {
      const next = [chat, ...s.chats];
      setTimeout(() => { saveChatsToStorage(next); }, 0);
      return { chats: next };
    }),
  updateChat: (id, patch) =>
    set((s) => {
      const next = s.chats.map((c) =>
        c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
      );
      setTimeout(() => { saveChatsToStorage(next); }, 0);
      return { chats: next };
    }),

  setMessages: (chatId, messages) =>
    set((s) => {
      const next = { ...s.messagesByChatId, [chatId]: messages };
      setTimeout(() => { saveMessagesToStorage(next); saveChatsToStorage(s.chats); }, 0);
      return { messagesByChatId: next };
    }),
  appendMessage: (chatId, message) =>
    set((s) => {
      const list = s.messagesByChatId[chatId] ?? [];
      const next = { ...s.messagesByChatId, [chatId]: [...list, message] };
      setTimeout(() => { saveMessagesToStorage(next); saveChatsToStorage(s.chats); }, 0);
      return { messagesByChatId: next };
    }),

  getDraft: (chatId) => get().draftsByChatId[chatId],
  setDraft: (chatId, draft) =>
    set((s) => {
      const next = { ...s.draftsByChatId, [chatId]: draft };
      setTimeout(() => saveDraftsToStorage(next), 0);
      return { draftsByChatId: next };
    }),

  setReport: (chatId, report) =>
    set((s) => ({
      reportsByChatId: { ...s.reportsByChatId, [chatId]: report },
    })),
  getReport: (chatId) => get().reportsByChatId[chatId],

  hydrateFromStorage: () =>
    set({
      chats: getChatsFromStorage(),
      messagesByChatId: getMessagesFromStorage(),
      draftsByChatId: getDraftsFromStorage(),
    }),
  persistToStorage: () => {
    const { chats, messagesByChatId, draftsByChatId } = get();
    saveChatsToStorage(chats);
    saveMessagesToStorage(messagesByChatId);
    saveDraftsToStorage(draftsByChatId);
  },
}));
