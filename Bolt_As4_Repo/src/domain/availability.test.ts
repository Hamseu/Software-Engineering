import { describe, expect, it } from 'vitest';
import { canBook, type CanBookInput } from '@/domain/availability';
import { ROOM_CATALOG } from '@/data/roomCatalog';

const booking = { start: 10 * 60, end: 11 * 60, label: 'Existing' };

function request(overrides: Partial<CanBookInput> = {}): CanBookInput {
  return {
    current: 8 * 60,
    start: 9 * 60,
    end: 9 * 60 + 60,
    isBlocked: false,
    existing: [booking],
    ...overrides,
  };
}

describe('canBook', () => {
  it('allows a free slot in an open room', () => {
    expect(canBook(request())).toEqual({ allow: true, reason: 'Room is available for this time.' });
  });

  describe('blocked rooms (AC3, F3)', () => {
    it('never allows a blocked room, even for a free slot', () => {
      const result = canBook(request({ isBlocked: true, existing: [] }));
      expect(result.allow).toBe(false);
    });

    it('reports blocked before any other problem', () => {
      const result = canBook(request({ isBlocked: true, start: 1, current: 500 }));
      expect(result.reason).toMatch(/blocked/i);
    });
  });

  describe('start and current time (AC1)', () => {
    it('rejects a start equal to the current time', () => {
      expect(canBook(request({ current: 540, start: 540, end: 600 })).allow).toBe(false);
    });

    it('rejects a start before the current time', () => {
      expect(canBook(request({ current: 540, start: 530, end: 600 })).allow).toBe(false);
    });

    it('rejects a current time outside the day', () => {
      expect(canBook(request({ current: 1440 })).allow).toBe(false);
      expect(canBook(request({ current: -1 })).allow).toBe(false);
    });

    it('rejects non-integer minutes', () => {
      expect(canBook(request({ start: 540.5, end: 600 })).allow).toBe(false);
    });
  });

  describe('window bounds (AC1)', () => {
    it('rejects end after midnight', () => {
      expect(canBook(request({ start: 1380, end: 1441, existing: [] })).allow).toBe(false);
    });

    it('allows a window that ends exactly at midnight', () => {
      expect(canBook(request({ start: 1380, end: 1440, existing: [] })).allow).toBe(true);
    });

    it('rejects start equal to end and start after end', () => {
      expect(canBook(request({ start: 600, end: 600 })).allow).toBe(false);
      expect(canBook(request({ start: 700, end: 600 })).allow).toBe(false);
    });
  });

  describe('duration (AC2)', () => {
    it('allows exactly 120 minutes', () => {
      expect(canBook(request({ start: 540, end: 660, existing: [] })).allow).toBe(true);
    });

    it('rejects 121 minutes', () => {
      const result = canBook(request({ start: 540, end: 661, existing: [] }));
      expect(result.allow).toBe(false);
      expect(result.reason).toContain('121');
    });
  });

  describe('overlaps (AC4)', () => {
    it('rejects a window that overlaps the start of a booking', () => {
      expect(canBook(request({ start: 9 * 60 + 30, end: 10 * 60 + 30 })).allow).toBe(false);
    });

    it('rejects a window that overlaps the end of a booking', () => {
      expect(canBook(request({ start: 10 * 60 + 30, end: 11 * 60 + 30 })).allow).toBe(false);
    });

    it('rejects a window that fully contains a booking', () => {
      expect(canBook(request({ start: 9 * 60 + 30, end: 11 * 60 + 30 })).allow).toBe(false);
    });

    it('rejects a window fully inside a booking', () => {
      expect(canBook(request({ start: 10 * 60 + 15, end: 10 * 60 + 45 })).allow).toBe(false);
    });

    it('allows a window that ends exactly when a booking starts', () => {
      expect(canBook(request({ start: 9 * 60, end: 10 * 60 })).allow).toBe(true);
    });

    it('allows a window that starts exactly when a booking ends', () => {
      expect(canBook(request({ start: 11 * 60, end: 12 * 60 })).allow).toBe(true);
    });
  });

  describe('room-specific bookings (scenario note 4)', () => {
    const b204 = ROOM_CATALOG.find((room) => room.id === 'b-204');
    const a118 = ROOM_CATALOG.find((room) => room.id === 'a-118');
    if (!b204 || !a118) throw new Error('Catalog is missing rooms used by this test');

    const window = { current: 8 * 60, start: 13 * 60 + 15, end: 13 * 60 + 45 };

    it('does not use another room bookings: A-118 is busy at 13:15 but B-204 is not', () => {
      expect(canBook({ ...window, isBlocked: a118.blocked, existing: a118.bookings }).allow).toBe(false);
      expect(canBook({ ...window, isBlocked: b204.blocked, existing: b204.bookings }).allow).toBe(true);
    });
  });
});
