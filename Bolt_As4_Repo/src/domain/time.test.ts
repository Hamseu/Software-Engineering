import { describe, expect, it } from 'vitest';
import { formatTime, nextQuarter, timeOptions } from '@/domain/time';
import { ROOM_CATALOG } from '@/data/roomCatalog';

describe('time helpers', () => {
  it('formats minutes as clock times, including end of day', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(615)).toBe('10:15');
    expect(formatTime(1440)).toBe('24:00');
  });

  it('rounds up to the next quarter hour', () => {
    expect(nextQuarter(540)).toBe(540);
    expect(nextQuarter(541)).toBe(555);
    expect(nextQuarter(1439)).toBe(1440);
  });

  it('lists quarter-hour options from midnight to end of day', () => {
    const options = timeOptions();
    expect(options[0]).toBe(0);
    expect(options[options.length - 1]).toBe(1440);
    expect(options.length).toBe(97);
    expect(options.every((time) => time % 15 === 0)).toBe(true);
  });
});

describe('room catalog', () => {
  it('has at least four rooms with unique ids', () => {
    const ids = ROOM_CATALOG.map((room) => room.id);
    expect(ROOM_CATALOG.length).toBeGreaterThanOrEqual(4);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(ROOM_CATALOG.map((room) => [room.id, room] as const))('%s has valid details', (_id, room) => {
    expect(room.name.length).toBeGreaterThan(0);
    expect(room.capacity).toBeGreaterThan(0);
    expect(Array.isArray(room.equipment)).toBe(true);
  });

  it.each(ROOM_CATALOG.map((room) => [room.id, room] as const))('%s has non-overlapping bookings within the day', (_id, room) => {
    const sorted = [...room.bookings].sort((a, b) => a.start - b.start);
    for (const item of sorted) {
      expect(item.start).toBeGreaterThanOrEqual(0);
      expect(item.end).toBeLessThanOrEqual(1440);
      expect(item.start).toBeLessThan(item.end);
    }
    for (let index = 1; index < sorted.length; index += 1) {
      expect(sorted[index].start).toBeGreaterThanOrEqual(sorted[index - 1].end);
    }
  });
});
