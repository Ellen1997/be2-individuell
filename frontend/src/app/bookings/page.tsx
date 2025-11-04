"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookingList from "@/components/Bookings/bookingList";
import { useUser } from "@/context/UserContext";
import { Booking } from "../../../../types/bookings";
import { PaginatedListResponse } from "../../../../types/general";

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

        if (user === undefined) {
            return;
        }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const res = await fetch(`${baseUrl}/api/bookings/`, {
          credentials: "include",
        });

        if (!res.ok) {
                const text = await res.text();
          throw new Error(text || "Misslyckades att hämta bokningar");
        }

        const data: PaginatedListResponse<Booking> = await res.json();
        setBookings(data.data);
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
      <Link href="/" className="text-blue-600 underline">
        Tillbaka till startsidan
      </Link>
      <h1 className="text-2xl font-bold">BOOKINGS</h1>
      <BookingList bookings={bookings} />
    </div>
  );
}
