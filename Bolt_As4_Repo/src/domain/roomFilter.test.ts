import { describe, expect, it } from 'vitest';
import { filterRooms, listEquipment, parseAttendees } from '@/domain/roomFilter';
import type { Room } from '@/domain/types';

const rooms: Room[] = [
  { id: 'big', name: 'Big', location: 'X', capacity: 40, equipment: ['Projector', 'Whiteboard'], blocked: false, bookings: [] },
  { id: 'small', name: 'Small', location: 'X', capacity: 8, equipment: ['Whiteboard'], blocked: false, bookings: [] },
  { id: 'lab', name: 'Lab', location: 'X', capacity: 24, equipment: ['Projector', 'Fume hood'], blocked: true, bookings: [] },
];

const noFilter = { minCapacity: null, equipment: [] };

describe('filterRooms', () => {
  it('returns every room when no filter is set', () => {
    expect(filterRooms(rooms, noFilter).map((room) => room.id)).toEqual(['big', 'small', 'lab']);
  });

  describe('capacity (F1)', () => {
    it('keeps rooms whose capacity equals the requested attendees', () => {
      expect(filterRooms(rooms, { minCapacity: 24, equipment: [] }).map((room) => room.id)).toEqual(['big', 'lab']);
    });

    it('drops rooms smaller than the requested attendees', () => {
      expect(filterRooms(rooms, { minCapacity: 25, equipment: [] }).map((room) => room.id)).toEqual(['big']);
    });
  });

  describe('equipment (F2)', () => {
    it('requires every selected item, not just one', () => {
      expect(filterRooms(rooms, { minCapacity: null, equipment: ['Projector', 'Whiteboard'] }).map((room) => room.id)).toEqual(['big']);
    });

    it('matches equipment exactly, not by partial name', () => {
      expect(filterRooms(rooms, { minCapacity: null, equipment: ['Board'] })).toEqual([]);
    });

    it('applies capacity and equipment together', () => {
      expect(filterRooms(rooms, { minCapacity: 10, equipment: ['Whiteboard'] }).map((room) => room.id)).toEqual(['big']);
    });
  });

  describe('no matches (F4)', () => {
    it('returns an empty list when nothing fits', () => {
      expect(filterRooms(rooms, { minCapacity: 100, equipment: [] })).toEqual([]);
    });
  });

  describe('separation from availability (F3, F6)', () => {
    it('does not hide blocked rooms; availability is decided elsewhere', () => {
      expect(filterRooms(rooms, { minCapacity: 24, equipment: ['Fume hood'] }).map((room) => room.id)).toEqual(['lab']);
    });
  });
});

describe('listEquipment', () => {
  it('returns each item once, sorted', () => {
    expect(listEquipment(rooms)).toEqual(['Fume hood', 'Projector', 'Whiteboard']);
  });
});

describe('parseAttendees', () => {
  it('treats empty input as no filter', () => {
    expect(parseAttendees('   ')).toEqual({ value: null, error: null });
  });

  it('accepts whole numbers of 1 or more', () => {
    expect(parseAttendees('1')).toEqual({ value: 1, error: null });
    expect(parseAttendees(' 12 ')).toEqual({ value: 12, error: null });
  });

  it.each(['0', '-3', '2.5', 'abc'])('rejects %s with feedback', (text) => {
    const result = parseAttendees(text);
    expect(result.value).toBeNull();
    expect(result.error).toBe('Enter a whole number of 1 or more.');
  });
});
