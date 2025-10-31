import type { Booking } from "../../../../types/bookings.js"

import Link from "next/link.js"


type BookingListProps = {
    bookings: Booking[]
}


export default function BookingList({bookings}: BookingListProps){
    return(
        <div className="grid gap-4">
            {bookings.map((booking) => (
                <div key={booking.booking_id}
                className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white">

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900"> {booking.properties?.property_name || "inget namn"}</h1>
                              <h3 className="text-lg font-semibold text-gray-900">
                               {booking.start_date}
                              </h3>
                              <h3 className="text-lg font-semibold text-gray-900">
                               {booking.end_date}
                              </h3>
                              <p className="text-gray-600">{booking.total_price}</p>
                              <p className="text-gray-600">Bokat av: {booking.profileusers?.name}</p>
                        </div>
                    </div>
             <div>
                <Link href={`/bookings/${booking.booking_id}`}>
                Detaljsida Booking
                </Link>
             </div>
                </div>
            ) 
            )}
          
        </div>
    )} 
