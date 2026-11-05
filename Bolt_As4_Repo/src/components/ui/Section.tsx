import type { ReactNode } from 'react';

export function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-slate-900">
        <span className="text-slate-500">{icon}</span>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}
