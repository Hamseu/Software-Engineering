export type Booking = {
  start: number;
  end: number;
  label: string;
};

export type Room = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
};

export type RoomCriteria = {
  minCapacity: number | null;
  equipment: string[];
};
