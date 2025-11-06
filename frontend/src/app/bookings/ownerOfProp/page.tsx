"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookingList from "@/components/Bookings/bookingList";
import { useUser } from "@/context/UserContext";
import { Booking } from "../../../../../types/bookings";
import { PaginatedListResponse } from "../../../../../types/general";

export default function BookingOwnerOfPropPage() {
  const { user, actions } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      
      if (user === null) {
            setError("Du måste vara inloggad för att se bokningar.");
            setLoading(false);
            return;
        }

      if (!user.ispropertyowner) {
      setError("Du måste vara property owner för att se eventuella property-bokningar.");
      setLoading(false);
      return;
    }

        if (user === undefined) {
            return;
        }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const res = await fetch(`${baseUrl}/api/bookings/ownerofproperty/${user.id}`, {
          credentials: "include",
        });

        if (!res.ok) {
                const text = await res.text();
          throw new Error(text || "Misslyckades att hämta bokningar");
        }

        const data: PaginatedListResponse<Booking> = await res.json();
        console.log("Booking-response:", data);
        
        setBookings(data.data || []);
      } catch (err: any) {
        setError(err.message || "Kunde inte hämta bokningar.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, actions]);

  if (loading) return <p className="p-16">Laddar bokningar...</p>;

  if (error)
    return (
      <div className="p-16">
        <Link href="/" className="text-blue-600 underline">
          Tillbaka till startsidan
        </Link>
        <h1 className="text-2xl font-bold">BOOKINGS</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="p-16">
      <p className="text-2xl font-bold text-neutral-900">Bokningar</p>
      <p className="text-xl font-bold text-gray-600">på mina uthyrningsobjekt:</p>
      <div className="mt-6"></div>

         {bookings.length === 0 ? (
        <p className="text-gray-600">Det finns inga bokningar ännu.</p>
      ) : (
        user && <BookingList bookings={bookings} currentUser={{
       id: user.id,
       ispropertyowner: user.ispropertyowner,
       isadmin: user.isadmin

        }} />
      )}
    </div>
  );
}