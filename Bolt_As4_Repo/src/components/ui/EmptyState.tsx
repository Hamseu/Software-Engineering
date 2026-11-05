import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
      <span className="text-slate-400">{icon}</span>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="max-w-xs text-xs text-slate-600">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
