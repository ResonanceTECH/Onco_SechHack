import type { Message, MessageBlock } from '../../types';

interface AssistantMessageProps {
  message: Message;
}

function BlockContent({ block }: { block: MessageBlock }) {
  if (block.type === 'text' || block.type === 'step_prompt') {
    return block.text ? <p className="text-slate-700 whitespace-pre-wrap">{block.text}</p> : null;
  }
  if (block.type === 'progress' && block.payload) {
    const stages = block.payload as { name: string; label: string; status: string }[];
    return (
      <div className="mt-2 space-y-1">
        {stages.map((s) => (
          <div key={s.name} className="flex items-center gap-2 text-sm">
            <span
              className={`
                w-2 h-2 rounded-full
                ${s.status === 'done' ? 'bg-emerald-500' : s.status === 'processing' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}
              `}
            />
            <span className="text-slate-600">{s.label}</span>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'report_cards' && block.payload) {
    const cards = block.payload as { type: string; count: number; label: string }[];
    return (
      <div className="mt-2 grid grid-cols-2 gap-2">
        {cards.map((c) => (
          <div
            key={c.type}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="font-medium text-slate-700">{c.label}</span>
            <span className="ml-2 text-slate-500">{c.count}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  return (
    <div className="flex justify-start px-4 py-2">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white border border-slate-200 px-4 py-2.5 shadow-sm">
        {message.blocks.map((block, i) => (
          <BlockContent key={i} block={block} />
        ))}
      </div>
    </div>
  );
}
