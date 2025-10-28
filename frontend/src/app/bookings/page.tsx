import BookingList from "@/components/Bookings/bookingList";
import { Booking } from "../../../../types/bookings";
import { PaginatedListResponse } from "../../../../types/general";
import Link from "next/link";

export default async function BookingPage() {
    const baseUrl = process.env.BACKEND_BASE_URL
    const url = `${baseUrl}/bookings/`
    const response = await fetch(url)
    const bookings: PaginatedListResponse<Booking>= await response.json()
    console.log(bookings)

    return(
        <div className ="p-16">
            <Link href="/" className="text-blue-600 underline">
              Tillbaka till startsidan
            </Link>
        <h1 className="text-2xl font-bold"> BOOKINGS </h1>
        <BookingList bookings={bookings.data} />
         </div>
    )
}