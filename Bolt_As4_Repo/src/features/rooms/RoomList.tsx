import { DoorClosed, Lock, SearchX, Unlock, Users } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Room } from '@/domain/types';

export function RoomList({
  rooms,
  selectedId,
  onSelect,
  onClearFilters,
  hasActiveFilters,
}: {
  rooms: Room[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <Section title="Rooms" icon={<DoorClosed size={18} />}>
      {rooms.length === 0 ? (
        <EmptyState
          icon={<SearchX size={28} />}
          title="No rooms match your filters"
          message="Try fewer attendees or fewer equipment items."
          action={
            hasActiveFilters ? (
              <button
                type="button"
                onClick={onClearFilters}
                className="min-h-9 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-700"
              >
                Clear filters
              </button>
            ) : null
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {rooms.map((room) => {
            const isSelected = room.id === selectedId;
            return (
              <li key={room.id}>
                <button
                  type="button"
                  onClick={() => onSelect(room.id)}
                  aria-pressed={isSelected}
                  className={`flex h-full w-full flex-col gap-3 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                    isSelected ? 'border-sky-600 bg-sky-50 ring-1 ring-sky-600' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{room.name}</p>
                      <p className="text-xs text-slate-500">{room.location}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        room.blocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {room.blocked ? <Lock size={12} aria-hidden="true" /> : <Unlock size={12} aria-hidden="true" />}
                      {room.blocked ? 'Blocked' : 'Open'}
                    </span>
                  </div>
                  <p className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                    <Users size={14} aria-hidden="true" />
                    Seats {room.capacity}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {room.equipment.map((item) => (
                      <li key={item} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
