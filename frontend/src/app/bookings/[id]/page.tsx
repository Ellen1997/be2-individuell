import type { Booking } from "../../../../../types/bookings";
import SingleBooking from "@/components/Bookings/SingleBooking";
import Link from "next/link.js";

type Params = {
    params: Promise<{id: string}>
}

export default async function BookingPage({params}: Params) {
    const {id} = await params;
    const baseUrl = process.env.BACKEND_BASE_URL;
    const url = `${baseUrl}/bookings/${id}`;
    const response = await fetch(url, {cache: "no-store"});
    const booking: Booking = await response.json();

    return(
        <div className="p-16">
            <Link href="/" className="text-blue-600 underline">
              Tillbaka till startsidan
            </Link>
      <h1 className="text-2xl font-bold mb-4">BOKNINGS DETALJ</h1>
      <SingleBooking booking={booking} />
      </div>

    )
    
}