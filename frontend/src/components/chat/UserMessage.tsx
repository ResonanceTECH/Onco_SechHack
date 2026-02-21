import type { Message } from '../../types';

interface UserMessageProps {
  message: Message;
}

export function UserMessage({ message }: UserMessageProps) {
  const text = message.blocks.find((b) => b.type === 'text' || b.type === 'step_summary')?.text;
  return (
    <div className="flex justify-end px-4 py-2">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 text-white px-4 py-2.5 shadow-sm">
        {text && <p className="text-sm whitespace-pre-wrap">{text}</p>}
      </div>
    </div>
  );
}
