import type { Message } from '../../types';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return message.role === 'assistant' ? (
    <AssistantMessage message={message} />
  ) : (
    <UserMessage message={message} />
  );
}
