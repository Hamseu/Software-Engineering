export const DAY_END = 1440;
export const TIME_STEP = 15;
export const MAX_DURATION = 120;

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function nextQuarter(minutes: number): number {
  return Math.min(DAY_END, Math.ceil(minutes / TIME_STEP) * TIME_STEP);
}

export function timeOptions(): number[] {
  return Array.from({ length: DAY_END / TIME_STEP + 1 }, (_, index) => index * TIME_STEP);
}

export function getDeviceMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}
