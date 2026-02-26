export type MessageRole = 'assistant' | 'user';

export type CaseStatus =
  | 'draft'
  | 'wizard'
  | 'verifying'
  | 'done'
  | 'failed'
  | 'cancelled';

export interface ChatCase {
  id: string;
  /** ID кейса в backend (/cases), если он привязан */
  backendId?: number;
  title: string;
  status: CaseStatus;
  updatedAt: string;
  nosology?: string;
  stage?: string;
  pinned?: boolean;
  archived?: boolean;
  groupId?: string;
}

export interface ChatGroup {
  id: string;
  name: string;
}

export type MessageBlockType =
  | 'text'
  | 'step_prompt'
  | 'step_summary'
  | 'progress'
  | 'report_cards'
  | 'issue'
  | 'guideline_ref'
  | 'action_buttons';

export interface MessageBlock {
  type: MessageBlockType;
  text?: string;
  payload?: unknown;
}

export interface Message {
  id: string;
  role: MessageRole;
  blocks: MessageBlock[];
  createdAt: string;
}
