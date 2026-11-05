import { CalendarCheck2 } from 'lucide-react';
import { ROOM_CATALOG } from '@/data/roomCatalog';
import { ResultBanner } from '@/components/ui/ResultBanner';
import { RoomList } from '@/features/rooms/RoomList';
import { RoomSearchPanel } from '@/features/rooms/RoomSearchPanel';
import { useRoomSearch } from '@/features/rooms/useRoomSearch';
import { BookingWindowPanel } from '@/features/availability/BookingWindowPanel';
import { RoomTimeline } from '@/features/availability/RoomTimeline';
import { useAvailability } from '@/features/availability/useAvailability';
import { useBookingWindow } from '@/features/availability/useBookingWindow';

export default function App() {
  const search = useRoomSearch(ROOM_CATALOG);
  const booking = useBookingWindow();
  const { selectedRoom } = search;
  const result = useAvailability(selectedRoom, {
    current: booking.current,
    start: booking.start,
    end: booking.end,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <CalendarCheck2 size={22} />
          </div>
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">Smart Campus</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Room Availability Checker</h1>
          <p className="mt-2 text-sm text-slate-600">
            Filter rooms by capacity and equipment, then check a time before planning your next session.
          </p>
        </header>

        <div className="space-y-5">
          <RoomSearchPanel
            attendeesText={search.attendeesText}
            attendeesError={search.attendeesError}
            onAttendeesChange={search.setAttendeesText}
            equipmentOptions={search.equipmentOptions}
            selectedEquipment={search.equipment}
            onToggleEquipment={search.toggleEquipment}
            hasActiveFilters={search.hasActiveFilters}
            onClearFilters={search.clearFilters}
            matchCount={search.matches.length}
            totalCount={ROOM_CATALOG.length}
          />

          <RoomList
            rooms={search.matches}
            selectedId={selectedRoom?.id ?? null}
            onSelect={search.selectRoom}
            onClearFilters={search.clearFilters}
            hasActiveFilters={search.hasActiveFilters}
          />

          <BookingWindowPanel
            current={booking.current}
            isManualCurrent={booking.isManualCurrent}
            start={booking.start}
            end={booking.end}
            onChangeCurrent={booking.changeCurrent}
            onChangeStart={booking.setStart}
            onChangeEnd={booking.setEnd}
            onUseDeviceTime={booking.useDeviceTime}
          />

          {selectedRoom && result ? (
            <>
              <ResultBanner
                tone={result.allow ? 'available' : 'unavailable'}
                title={result.allow ? 'Available' : 'Unavailable'}
                message={`${selectedRoom.name}: ${result.reason}`}
              />
              <RoomTimeline
                room={selectedRoom}
                current={booking.current}
                start={booking.start}
                end={booking.end}
                allowed={result.allow}
              />
            </>
          ) : (
            <ResultBanner
              tone="neutral"
              title="No room selected"
              message="Adjust the filters to show a room, then check its availability."
            />
          )}
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">Checks availability only · No booking is created</footer>
      </div>
    </div>
  );
}
