import { create } from 'zustand';
import type { ChatCase, Message, CaseDraft, Report, ChatGroup } from '../types';
import {
  getChatsFromStorage,
  saveChatsToStorage,
  getMessagesFromStorage,
  saveMessagesToStorage,
  getDraftsFromStorage,
  saveDraftsToStorage,
  getGroupsFromStorage,
  saveGroupsToStorage,
} from '../api/mock';

interface ChatState {
  chats: ChatCase[];
  groups: ChatGroup[];
  activeChatId: string | null;
  /** Режим переименования: id чата, который редактируется в строке ввода */
  editingChatId: string | null;
  /** Режим ввода названия новой группы в строке ввода */
  creatingGroup: boolean;
  messagesByChatId: Record<string, Message[]>;
  draftsByChatId: Record<string, CaseDraft>;
  reportsByChatId: Record<string, Report>;
  setChats: (chats: ChatCase[]) => void;
  setActiveChatId: (id: string | null) => void;
  setEditingChatId: (id: string | null) => void;
  setCreatingGroup: (v: boolean) => void;
  addChat: (chat: ChatCase) => void;
  updateChat: (id: string, patch: Partial<ChatCase>) => void;
  deleteChat: (id: string) => void;
  addGroup: (name: string) => void;
  removeGroup: (groupId: string) => void;
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
  groups: [],
  activeChatId: null,
  editingChatId: null,
  creatingGroup: false,
  messagesByChatId: {},
  draftsByChatId: {},
  reportsByChatId: {},

  setChats: (chats) => set({ chats }),
  setActiveChatId: (activeChatId) => set({ activeChatId }),
  setEditingChatId: (editingChatId) => set({ editingChatId }),
  setCreatingGroup: (creatingGroup) => set({ creatingGroup }),
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
  deleteChat: (id) =>
    set((s) => {
      const nextChats = s.chats.filter((c) => c.id !== id);
      const nextMessages = { ...s.messagesByChatId };
      delete nextMessages[id];
      const nextDrafts = { ...s.draftsByChatId };
      delete nextDrafts[id];
      const nextReports = { ...s.reportsByChatId };
      delete nextReports[id];
      const nextActive = s.activeChatId === id ? (nextChats[0]?.id ?? null) : s.activeChatId;
      setTimeout(() => {
        saveChatsToStorage(nextChats);
        saveMessagesToStorage(nextMessages);
        saveDraftsToStorage(nextDrafts);
      }, 0);
      return {
        chats: nextChats,
        messagesByChatId: nextMessages,
        draftsByChatId: nextDrafts,
        reportsByChatId: nextReports,
        activeChatId: nextActive,
      };
    }),
  addGroup: (name) =>
    set((s) => {
      const group: ChatGroup = { id: `group-${Date.now()}`, name: name.trim() || 'Группа' };
      const next = [...s.groups, group];
      setTimeout(() => saveGroupsToStorage(next), 0);
      return { groups: next };
    }),
  removeGroup: (groupId) =>
    set((s) => {
      const next = s.groups.filter((g) => g.id !== groupId);
      const nextChats = s.chats.map((c) => (c.groupId === groupId ? { ...c, groupId: undefined } : c));
      setTimeout(() => {
        saveGroupsToStorage(next);
        saveChatsToStorage(nextChats);
      }, 0);
      return { groups: next, chats: nextChats };
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
      groups: getGroupsFromStorage(),
      messagesByChatId: getMessagesFromStorage(),
      draftsByChatId: getDraftsFromStorage(),
    }),
  persistToStorage: () => {
    const { chats, groups, messagesByChatId, draftsByChatId } = get();
    saveChatsToStorage(chats);
    saveGroupsToStorage(groups);
    saveMessagesToStorage(messagesByChatId);
    saveDraftsToStorage(draftsByChatId);
  },
}));
