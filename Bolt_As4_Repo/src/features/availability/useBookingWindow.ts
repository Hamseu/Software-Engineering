import { useEffect, useState } from 'react';
import { DAY_END, MAX_DURATION, getDeviceMinutes, nextQuarter } from '@/domain/time';

const DEFAULT_LENGTH = 60;

export type BookingRange = { start: number; end: number };

function rangeAfter(time: number): BookingRange {
  const start = nextQuarter(time + 1);
  return { start, end: Math.min(DAY_END, start + DEFAULT_LENGTH) };
}

function fitEnd(start: number, end: number): number {
  const isValid = end > start && end <= start + MAX_DURATION;
  return isValid ? end : Math.min(DAY_END, start + DEFAULT_LENGTH);
}

export function useBookingWindow() {
  const [deviceTime, setDeviceTime] = useState(getDeviceMinutes);
  const [manualCurrent, setManualCurrent] = useState<number | null>(null);
  const [range, setRange] = useState<BookingRange>(() => rangeAfter(getDeviceMinutes()));

  useEffect(() => {
    const timer = window.setInterval(() => setDeviceTime(getDeviceMinutes()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const setStart = (start: number) =>
    setRange((previous) => ({ start, end: fitEnd(start, previous.end) }));

  const setEnd = (end: number) => setRange((previous) => ({ start: previous.start, end }));

  const changeCurrent = (time: number) => {
    setManualCurrent(time);
    setRange(rangeAfter(time));
  };

  const useDeviceTime = () => {
    setManualCurrent(null);
    setRange(rangeAfter(deviceTime));
  };

  return {
    current: manualCurrent ?? deviceTime,
    isManualCurrent: manualCurrent !== null,
    start: range.start,
    end: range.end,
    setStart,
    setEnd,
    changeCurrent,
    useDeviceTime,
  };
}
