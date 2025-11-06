"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MYbookingList from "@/components/Bookings/MYbookingList";
import { useUser } from "@/context/UserContext";
import { Booking } from "../../../../../types/bookings";

export default function BookingPage() {
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

      if (user === undefined) return;

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const res = await fetch(`${baseUrl}/api/bookings/user/${user.id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Misslyckades att hämta bokningar");
        }

        const data: Booking[] = await res.json();


        setBookings(Array.isArray(data) ? data : []);
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
        <h1 className="text-2xl font-bold">BOOKINGS</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );

    console.log("Current bookings:", bookings);

    if(bookings.length === 0)
        return(
         <div className="p-16">
        <h1 className="text-2xl font-bold">Mina bokningar</h1>
        <p className="text-gray-600">Du har inga bokningar ännu...</p>
      </div>
        );
  return (
    <div className="p-16">
      <h1 className="text-2xl font-bold mb-4">Mina bokningar</h1>

      {user && (
        <MYbookingList
          bookings={bookings}
          currentUser={{
            id: user.id,
            ispropertyowner: user.ispropertyowner,
            isadmin: user.isadmin
          }}
        />
      )}
    </div>
  );
}
