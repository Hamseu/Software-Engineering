import type { ReactNode } from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

type Tone = 'available' | 'unavailable' | 'neutral';

const TONES: Record<Tone, { box: string; title: string; text: string; icon: ReactNode }> = {
  available: {
    box: 'border-emerald-200 bg-emerald-50',
    title: 'text-emerald-900',
    text: 'text-emerald-800',
    icon: <CheckCircle2 size={24} className="mt-0.5 shrink-0 text-emerald-600" />,
  },
  unavailable: {
    box: 'border-rose-200 bg-rose-50',
    title: 'text-rose-900',
    text: 'text-rose-800',
    icon: <XCircle size={24} className="mt-0.5 shrink-0 text-rose-600" />,
  },
  neutral: {
    box: 'border-slate-200 bg-white',
    title: 'text-slate-900',
    text: 'text-slate-600',
    icon: <Info size={24} className="mt-0.5 shrink-0 text-slate-500" />,
  },
};

export function ResultBanner({ tone, title, message }: { tone: Tone; title: string; message: string }) {
  const style = TONES[tone];

  return (
    <div role="status" className={`rounded-2xl border p-5 shadow-sm transition ${style.box}`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div>
          <p className={`text-lg font-bold tracking-tight ${style.title}`}>{title}</p>
          <p className={`mt-0.5 text-sm ${style.text}`}>{message}</p>
        </div>
      </div>
    </div>
  );
}
