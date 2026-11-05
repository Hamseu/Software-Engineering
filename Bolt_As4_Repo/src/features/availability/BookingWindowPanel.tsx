import { Clock } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SelectField, type SelectOption } from '@/components/ui/SelectField';
import { DAY_END, MAX_DURATION, formatTime, timeOptions } from '@/domain/time';

function withSelected(times: number[], selected: number): SelectOption[] {
  const all = times.includes(selected) ? times : [...times, selected].sort((a, b) => a - b);
  return all.map((time) => ({ value: String(time), label: formatTime(time) }));
}

export function BookingWindowPanel({
  current,
  isManualCurrent,
  start,
  end,
  onChangeCurrent,
  onChangeStart,
  onChangeEnd,
  onUseDeviceTime,
}: {
  current: number;
  isManualCurrent: boolean;
  start: number;
  end: number;
  onChangeCurrent: (time: number) => void;
  onChangeStart: (time: number) => void;
  onChangeEnd: (time: number) => void;
  onUseDeviceTime: () => void;
}) {
  const allTimes = timeOptions();
  const currentOptions = withSelected(
    allTimes.filter((time) => time < DAY_END),
    current
  );
  const startOptions = withSelected(
    allTimes.filter((time) => time > current && time < DAY_END),
    start
  );
  const endOptions = withSelected(
    allTimes.filter((time) => time > start && time <= Math.min(DAY_END, start + MAX_DURATION)),
    end
  );
  const duration = end - start;
  const isDurationValid = duration >= 1 && duration <= MAX_DURATION;

  return (
    <Section title="Booking window" icon={<Clock size={18} />}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <SelectField
          label="Current time"
          value={String(current)}
          options={currentOptions}
          onChange={(value) => onChangeCurrent(Number(value))}
          footer={
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className={isManualCurrent ? 'text-slate-500' : 'font-medium text-emerald-700'}>
                {isManualCurrent ? 'Manual test time' : 'Live device time'}
              </span>
              {isManualCurrent && (
                <button
                  type="button"
                  onClick={onUseDeviceTime}
                  className="min-h-8 font-medium text-sky-700 hover:text-sky-900"
                >
                  Use live time
                </button>
              )}
            </div>
          }
        />
        <SelectField
          label="Start"
          value={String(start)}
          options={startOptions}
          onChange={(value) => onChangeStart(Number(value))}
          footer={<span className="text-[11px] text-slate-500">Must be after the current time</span>}
        />
        <SelectField
          label="End"
          value={String(end)}
          options={endOptions}
          onChange={(value) => onChangeEnd(Number(value))}
          footer={<span className="text-[11px] text-slate-500">Up to {MAX_DURATION} minutes after start</span>}
        />
      </div>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-600">
        <span>
          Duration:{' '}
          <span className={`font-semibold ${isDurationValid ? 'text-slate-900' : 'text-rose-600'}`}>
            {duration} min
          </span>
        </span>
        <span>
          Window: <span className="font-semibold text-slate-900">{formatTime(start)}–{formatTime(end)}</span>
        </span>
      </div>
    </Section>
  );
}
