import { useMemo, useState } from 'react';
import { filterRooms, listEquipment, parseAttendees } from '@/domain/roomFilter';
import type { Room, RoomCriteria } from '@/domain/types';

export function useRoomSearch(rooms: Room[]) {
  const [attendeesText, setAttendeesText] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const attendees = parseAttendees(attendeesText);
  const criteria = useMemo<RoomCriteria>(
    () => ({ minCapacity: attendees.value, equipment }),
    [attendees.value, equipment]
  );
  const matches = useMemo(() => filterRooms(rooms, criteria), [rooms, criteria]);
  const equipmentOptions = useMemo(() => listEquipment(rooms), [rooms]);
  const selectedRoom = matches.find((room) => room.id === selectedId) ?? matches[0] ?? null;

  const toggleEquipment = (item: string) => {
    setEquipment((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item]
    );
  };

  const clearFilters = () => {
    setAttendeesText('');
    setEquipment([]);
  };

  return {
    attendeesText,
    setAttendeesText,
    attendeesError: attendees.error,
    equipment,
    equipmentOptions,
    toggleEquipment,
    hasActiveFilters: attendeesText.trim() !== '' || equipment.length > 0,
    clearFilters,
    matches,
    selectedRoom,
    selectRoom: setSelectedId,
  };
}
