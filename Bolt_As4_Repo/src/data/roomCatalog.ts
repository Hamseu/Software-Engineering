import type { Room } from '@/domain/types';

export const ROOM_CATALOG: Room[] = [
  {
    id: 'b-204',
    name: 'B-204',
    location: 'Engineering Block',
    capacity: 40,
    equipment: ['Projector', 'Video conferencing', 'Whiteboard'],
    blocked: false,
    bookings: [
      { start: 9 * 60, end: 10 * 60, label: 'Intro to CS lecture' },
      { start: 11 * 60, end: 12 * 60 + 30, label: 'Faculty meeting' },
      { start: 14 * 60, end: 15 * 60, label: 'Study group' },
      { start: 16 * 60 + 30, end: 17 * 60 + 30, label: 'Lab session' },
    ],
  },
  {
    id: 'a-118',
    name: 'A-118',
    location: 'Arts Building',
    capacity: 24,
    equipment: ['Whiteboard', 'Smart TV', 'Sound system'],
    blocked: false,
    bookings: [
      { start: 8 * 60, end: 9 * 60 + 30, label: 'Design workshop' },
      { start: 13 * 60, end: 14 * 60, label: 'Office hours' },
      { start: 15 * 60 + 30, end: 17 * 60, label: 'Project critique' },
    ],
  },
  {
    id: 'c-301',
    name: 'C-301',
    location: 'Science Center',
    capacity: 60,
    equipment: ['Lab benches', 'Fume hood', 'Projector'],
    blocked: true,
    bookings: [{ start: 10 * 60, end: 12 * 60, label: 'Chemistry lab' }],
  },
  {
    id: 'd-105',
    name: 'D-105',
    location: 'Library',
    capacity: 8,
    equipment: ['Smart TV', 'Video conferencing', 'Whiteboard'],
    blocked: false,
    bookings: [{ start: 12 * 60, end: 13 * 60, label: 'Group project' }],
  },
  {
    id: 'e-012',
    name: 'E-012',
    location: 'Library Annex',
    capacity: 12,
    equipment: ['Computers', 'Whiteboard'],
    blocked: false,
    bookings: [],
  },
];
