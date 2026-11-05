import { SlidersHorizontal, Users } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { ToggleChip } from '@/components/ui/ToggleChip';
import { fieldClass } from '@/components/ui/styles';

export function RoomSearchPanel({
  attendeesText,
  attendeesError,
  onAttendeesChange,
  equipmentOptions,
  selectedEquipment,
  onToggleEquipment,
  hasActiveFilters,
  onClearFilters,
  matchCount,
  totalCount,
}: {
  attendeesText: string;
  attendeesError: string | null;
  onAttendeesChange: (value: string) => void;
  equipmentOptions: string[];
  selectedEquipment: string[];
  onToggleEquipment: (item: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  matchCount: number;
  totalCount: number;
}) {
  return (
    <Section title="Find a room" icon={<SlidersHorizontal size={18} />}>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-600">Attendees</span>
          <div className="relative">
            <Users size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              placeholder="Any"
              value={attendeesText}
              onChange={(event) => onAttendeesChange(event.target.value)}
              aria-invalid={attendeesError !== null}
              className={`${fieldClass} pl-9 ${attendeesError ? '!border-rose-500 focus:!border-rose-600 focus:!ring-rose-600' : ''}`}
            />
          </div>
          <span className={`text-[11px] ${attendeesError ? 'font-medium text-rose-700' : 'text-slate-500'}`}>
            {attendeesError ?? 'Shows rooms that seat at least this many people.'}
          </span>
        </label>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-xs font-medium text-slate-600">Required equipment</legend>
          <div className="flex flex-wrap gap-2">
            {equipmentOptions.map((item) => (
              <ToggleChip
                key={item}
                label={item}
                pressed={selectedEquipment.includes(item)}
                onToggle={() => onToggleEquipment(item)}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-500">A room must have every item you select.</span>
        </fieldset>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-600">
          Showing <span className="font-semibold text-slate-900">{matchCount}</span> of {totalCount} rooms
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className="min-h-9 rounded-lg px-3 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 hover:text-sky-900 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
        >
          Clear filters
        </button>
      </div>
    </Section>
  );
}
