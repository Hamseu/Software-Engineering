import { MAX_DURATION, DAY_END, formatTime } from '@/domain/time';
import type { Booking } from '@/domain/types';

export type CanBookInput = {
  current: number;
  start: number;
  end: number;
  isBlocked: boolean;
  existing: Booking[];
};

export type CheckResult = {
  allow: boolean;
  reason: string;
};

export function canBook(input: CanBookInput): CheckResult {
  const { current, start, end, isBlocked, existing } = input;

  // AC3: A blocked room is never available.
  if (isBlocked) {
    return { allow: false, reason: 'This room is currently blocked and cannot be booked.' };
  }

  // AC1: Times must be integer minutes after midnight.
  if (!Number.isInteger(current) || !Number.isInteger(start) || !Number.isInteger(end)) {
    return { allow: false, reason: 'All times must be whole minutes.' };
  }

  // AC1: Current time must be within the day.
  if (current < 0 || current >= DAY_END) {
    return { allow: false, reason: 'Current time must be within the day (00:00–23:59).' };
  }

  // AC1: The start time must be strictly after the current time.
  if (start <= current) {
    return { allow: false, reason: 'Start time must be later than the current time.' };
  }

  // AC1: Require 0 <= start < end <= 1440.
  if (start < 0 || end > DAY_END || start >= end) {
    return { allow: false, reason: 'Booking window must satisfy 00:00 ≤ start < end ≤ 24:00.' };
  }

  // AC4: Reject overlaps; bookings that touch at an endpoint are allowed.
  for (const booking of existing) {
    if (start < booking.end && booking.start < end) {
      return {
        allow: false,
        reason: `Overlaps an existing booking (${formatTime(booking.start)}–${formatTime(booking.end)}).`,
      };
    }
  }

  // AC2: Duration must be from 1 to 120 minutes, inclusive.
  const duration = end - start;
  if (duration < 1 || duration > MAX_DURATION) {
    return {
      allow: false,
      reason: `Duration must be between 1 and ${MAX_DURATION} minutes (requested ${duration}).`,
    };
  }

  // AC5: Return availability without changing the existing bookings.
  return { allow: true, reason: 'Room is available for this time.' };
}
