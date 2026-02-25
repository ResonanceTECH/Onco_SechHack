import type { ChatCase, Message, CaseDraft, ChatGroup } from '../../types';

const STORAGE_CHATS = 'onco_chats';
const STORAGE_MESSAGES = 'onco_messages';
const STORAGE_DRAFTS = 'onco_drafts';
const STORAGE_GROUPS = 'onco_chat_groups';

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function getChatsFromStorage(): ChatCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_CHATS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChatsToStorage(chats: ChatCase[]): void {
  localStorage.setItem(STORAGE_CHATS, JSON.stringify(chats));
}

export function getMessagesFromStorage(): Record<string, Message[]> {
  try {
    const raw = localStorage.getItem(STORAGE_MESSAGES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveMessagesToStorage(messagesByChatId: Record<string, Message[]>): void {
  localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messagesByChatId));
}

export function getDraftsFromStorage(): Record<string, CaseDraft> {
  try {
    const raw = localStorage.getItem(STORAGE_DRAFTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveDraftsToStorage(draftsByChatId: Record<string, CaseDraft>): void {
  localStorage.setItem(STORAGE_DRAFTS, JSON.stringify(draftsByChatId));
}

export async function mockCreateChat(title: string): Promise<ChatCase> {
  await delay(200);
  const chat: ChatCase = {
    id: `case-${Date.now()}`,
    title: title || 'Новая проверка',
    status: 'draft',
    updatedAt: new Date().toISOString(),
  };
  return chat;
}

export async function mockUpdateChat(id: string, patch: Partial<ChatCase>): Promise<ChatCase> {
  await delay(100);
  return { id, title: '', status: 'draft', updatedAt: new Date().toISOString(), ...patch };
}

export async function mockGetMissingFields(_caseId: string): Promise<string[]> {
  await delay(600);
  return [];
}

export function getGroupsFromStorage(): ChatGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_GROUPS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGroupsToStorage(groups: ChatGroup[]): void {
  localStorage.setItem(STORAGE_GROUPS, JSON.stringify(groups));
}
