import type { Booking } from "../../../../types/bookings.js"
import Link from "next/link.js"

type SingleBookingProps = {
    booking: Booking
}


export default function SingleBooking({booking}: SingleBookingProps){
    return(
        <div className="grid gap-4">
                <div
                className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white">

                    <div className="flex justify-between items-start">
                        <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                               Bostad bokad: {booking.properties?.property_name}
                              </h3>  
                                <h3 className="text-lg font-semibold text-gray-900">
                               Bostad ägs av: {booking.properties?.profileusers?.name}
                              </h3>  
                              
                              <h3 className="text-lg font-semibold text-gray-900">
                               Bokning startar: {booking.start_date}
                              </h3>
                              <h3 className="text-lg font-semibold text-gray-900">
                               Bokning avslutas: {booking.end_date}
                              </h3>
                              <p className="text-gray-600"> Totalt pris för bokning: {booking.total_price}</p>
                              <h2 className="text-lg font-semibold text-gray-900">
                                Bokning tillhör:
                                {booking.profileusers?.name}
                              </h2>
                              <p className="text-gray-600">Kontaktinfo kund:</p>
                              <p className="text-gray-600">Mail: {booking.profileusers?.email}</p>
                              <p className="text-gray-600">Phone: {booking.profileusers?.phone_number}</p>

                        </div>
                    </div>
             <div>
                <Link href="/bookings">
                Tillbaka till Bookings
                </Link>
             </div>
                </div>
 
        </div>
    )} 
