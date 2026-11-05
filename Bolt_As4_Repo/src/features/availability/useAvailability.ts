import { useMemo } from 'react';
import { canBook, type CheckResult } from '@/domain/availability';
import type { Room } from '@/domain/types';

export function useAvailability(
  room: Room | null,
  request: { current: number; start: number; end: number }
): CheckResult | null {
  const { current, start, end } = request;

  return useMemo(
    () =>
      room
        ? canBook({
            current,
            start,
            end,
            isBlocked: room.blocked,
            existing: room.bookings,
          })
        : null,
    [room, current, start, end]
  );
}
