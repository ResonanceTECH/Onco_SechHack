interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="text-center max-w-sm">
      {icon && <div className="mb-3 flex justify-center text-slate-400">{icon}</div>}
      <h3 className="text-lg font-medium text-slate-700">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}
