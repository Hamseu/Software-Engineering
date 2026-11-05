import type { Room, RoomCriteria } from '@/domain/types';

export function filterRooms(rooms: Room[], criteria: RoomCriteria): Room[] {
  return rooms.filter((room) => {
    // F1: Room capacity must be greater than or equal to the attendees.
    const seatsEnough = criteria.minCapacity === null || room.capacity >= criteria.minCapacity;
    // F2: Room must contain every selected equipment item.
    const hasEquipment = criteria.equipment.every((item) => room.equipment.includes(item));
    return seatsEnough && hasEquipment;
  });
}

export function listEquipment(rooms: Room[]): string[] {
  return [...new Set(rooms.flatMap((room) => room.equipment))].sort((a, b) => a.localeCompare(b));
}

export function parseAttendees(text: string): { value: number | null; error: string | null } {
  const trimmed = text.trim();
  if (trimmed === '') return { value: null, error: null };

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return { value: null, error: 'Enter a whole number of 1 or more.' };
  }
  return { value: parsed, error: null };
}
