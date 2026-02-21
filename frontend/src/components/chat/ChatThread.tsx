import { useRef, useEffect } from 'react';
import type { Message } from '../../types';
import { ChatMessage } from './ChatMessage';
import { EmptyState } from '../platform-ui/EmptyState';

interface ChatThreadProps {
  messages: Message[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ChatThread({
  messages,
  emptyTitle = 'Нет сообщений',
  emptyDescription = 'Начните с выбора нозологии и контекста или напишите сообщение.',
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto py-4">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
