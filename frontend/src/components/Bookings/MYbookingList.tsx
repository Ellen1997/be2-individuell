import type { Booking } from "../../../../types/bookings.js"

import Link from "next/link.js"

type BookingListProps = {
    bookings: Booking[];
    currentUser?: {
        id: string;
        ispropertyowner: boolean;
        isadmin: boolean;
    }
}


export default function MYBookingList({bookings, currentUser}: BookingListProps){
    
    return (
    <div className="grid gap-4">
      {bookings.map((booking) => {
        const canAccept =
          currentUser &&
          (currentUser.isadmin) &&
          booking.booking_status === "pending";

        return (
          <div
            key={booking.booking_id}
            className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {booking.properties?.property_name || "inget namn"}
                </h1>
                <h3 className="text-gray-700">
                  Start: {booking.start_date} - Slut: {booking.end_date}
                </h3>
                <p className="text-gray-600">Pris totalt: {booking.total_price}</p>
                <p className="text-gray-600">Bokat av: {booking.profileusers?.name || "Okänd"}</p>
              </div>
            </div>

  <p className="mt-2 font-semibold">Status: {booking.booking_status}</p>

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