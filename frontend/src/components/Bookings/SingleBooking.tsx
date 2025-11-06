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
                              <h3 className="text-2xl font-semibold text-gray-900">
                                Uthyrningsobjekt:
                              </h3>  
                              <div className="mt-6"></div>
                               <h3 className="text-xl font-semibold text-gray-900">
                                {booking.properties?.property_name}
                              </h3> 
                                <h4 className="text-lg font-medium text-gray-600">
                               <p>Bostad ägs av: {booking.properties?.profileusers?.name}</p>
                              </h4>  
                              <div className="mt-6"></div>

                              <h3 className="text-xl font-semibold text-gray-900">
                                Information bokning:
                              </h3> 

                              <h3 className="text-lg font-semibold text-gray-600">
                               Bokning startar: {booking.start_date}
                              </h3>
                              <h3 className="text-lg font-semibold text-gray-600">
                               Bokning avslutas: {booking.end_date}
                              </h3>

                              <p className="text-gray-600 font-bold"> Totalt pris för bokning: {booking.total_price}</p>
                              <p className="text-gray-600 font-extrabold">Bokningsstatus: {booking.booking_status}</p>
                              <div className="mt-6"></div>
                              <h2 className="text-xl font-semibold text-gray-900">
                                Bokning tillhör: {booking.profileusers?.name}
                              </h2>
                              <p className="text-gray-600 font-bold ">Kontaktinfo:</p>
                              <p className="text-gray-600">Mail: {booking.profileusers?.email}</p>
                              <p className="text-gray-600">Phone: {booking.profileusers?.phone_number}</p>

                        </div>
                    </div>
                 <div>

             </div>
                </div>
 
        </div>
    )} 
