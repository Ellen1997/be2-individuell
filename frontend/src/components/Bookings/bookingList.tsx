import type { Booking } from "../../../../types/bookings.js"
import AcceptBookingButton from "../Buttons/acceptBookingBtn"
import DeclineBookingButton from "../Buttons/nekaBookingBtn"
import DeleteBookingButton from "../Buttons/DeleteBookingBtn"

import Link from "next/link.js"
import { useState } from "react"


type BookingListProps = {
    bookings: Booking[];
    currentUser?: {
        id: string;
        ispropertyowner: boolean;
        isadmin: boolean;
    }
}


export default function BookingList({bookings: initialBookings, currentUser}: BookingListProps){

    const [bookings, setBookings] = useState(initialBookings);
    
    return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
     {bookings.map((booking) => {
    const canAccept =
      currentUser &&
      (currentUser.ispropertyowner || currentUser.isadmin) &&
      booking.booking_status === "pending";

    return (
      <div
        key={booking.booking_id}
        className="border rounded-2xl p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold text-gray-900">
            {booking.properties?.property_name || "inget namn"}
          </h1>
          <h3 className="text-gray-700">
            Start: {booking.start_date} - Slut: {booking.end_date}
          </h3>
          <p className="text-gray-600">Pris totalt: {booking.total_price}</p>
          <p className="text-gray-600">Bokat av: {booking.profileusers?.name || "Okänd"}</p>
        </div>

        {canAccept ? (
          <div className="flex gap-2 mt-2">
            <AcceptBookingButton
              bookingId={booking.booking_id}
              onStatusChange={(newStatus) =>
                setBookings((prev) =>
                  prev.map((b) =>
                    b.booking_id === booking.booking_id ? { ...b, booking_status: newStatus } : b
                  )
                )
              }
            />
            <DeclineBookingButton
              bookingId={booking.booking_id}
              onStatusChange={(newStatus) =>
                setBookings((prev) =>
                  prev.map((b) =>
                    b.booking_id === booking.booking_id ? { ...b, booking_status: newStatus } : b
                  )
                )
              }
            />
            <DeleteBookingButton
              bookingId={booking.booking_id}
              onDeleted={() =>
                setBookings((prev) =>
                  prev.filter((b) => b.booking_id !== booking.booking_id)
                )
              }
            />
          </div>
        ) : (
          <p className="mt-2 font-semibold">Status: {booking.booking_status}</p>
        )}

        <div className="mt-2">
          <Link
            href={`/bookings/${booking.booking_id}`}
            className="text-blue-600 underline"
          >
            Detaljsida Booking
          </Link>
        </div>
      </div>
    );
  })}
</div>

  );
}
