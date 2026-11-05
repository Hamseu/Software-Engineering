import { Info } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { formatTime } from '@/domain/time';
import type { Room } from '@/domain/types';

const TIMELINE_HOURS = [0, 4, 8, 12, 16, 20, 24];

export function RoomTimeline({
  room,
  current,
  start,
  end,
  allowed,
}: {
  room: Room;
  current: number;
  start: number;
  end: number;
  allowed: boolean;
}) {
  const percent = (minutes: number) => `${(minutes / 1440) * 100}%`;

  return (
    <Section title={`Today's timeline · ${room.name}`} icon={<Info size={18} />}>
      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-400" /> Existing booking
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-600" /> Requested window
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-px bg-amber-500" /> Current time
        </span>
      </div>
      <div className="relative h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {room.bookings.map((booking) => (
          <div
            key={`${booking.start}-${booking.end}`}
            className="absolute top-2 bottom-7 flex min-w-0 items-start overflow-hidden rounded bg-slate-400 px-1.5 py-1 text-[10px] font-medium leading-tight text-white"
            style={{ left: percent(booking.start), width: percent(booking.end - booking.start) }}
            title={`${booking.label} · ${formatTime(booking.start)}–${formatTime(booking.end)}`}
          >
            <span className="truncate">{booking.label}</span>
          </div>
        ))}
        {start < end && (
          <div
            className={`absolute top-2 bottom-7 rounded border ${
              allowed ? 'border-sky-700 bg-sky-600' : 'border-sky-500 bg-sky-500/50'
            }`}
            style={{ left: percent(start), width: percent(Math.min(end, 1440) - start) }}
            title={`Requested · ${formatTime(start)}–${formatTime(end)}`}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between border-t border-slate-200 px-1 pt-1 text-[10px] text-slate-500">
          {TIMELINE_HOURS.map((hour) => (
            <span key={hour}>{String(hour).padStart(2, '0')}:00</span>
          ))}
        </div>
        <div
          className="absolute top-0 bottom-6 w-px bg-amber-500"
          style={{ left: percent(current) }}
          title={`Current time · ${formatTime(current)}`}
        />
      </div>
      <ul className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/70 px-3">
        {room.bookings.length === 0 && (
          <li className="py-2.5 text-sm text-slate-500">No bookings today.</li>
        )}
        {room.bookings.map((booking) => (
          <li
            key={`detail-${booking.start}-${booking.end}`}
            className="flex flex-col gap-1 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-slate-800">{booking.label}</span>
            <span className="font-mono text-xs text-slate-600">
              {formatTime(booking.start)}–{formatTime(booking.end)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        Existing bookings are fixed. This tool only checks availability and does not create a booking.
      </p>
    </Section>
  );
}
