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

  const [limit, setLimit] = useState(7);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);


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
        setLoading(true);

        const params = new URLSearchParams();

        params.append("limit", String(limit));
        params.append("offset", String(offset));

        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

        const res = await fetch(`${baseUrl}/api/bookings?${params.toString()}`, {
          credentials: "include",
        });

        if (!res.ok) {
                const text = await res.text();
          throw new Error(text || "Misslyckades att hämta bokningar");
        }

        const data: PaginatedListResponse<Booking> = await res.json();
        setBookings(data.data);
        setCount(data.count);
      } catch (err: any) {
        setError(err.message || "Kunde inte hämta bokningar.");
      } finally {
        setLoading(false);
      }
    };

      useEffect(() => {
        if (user === null) {
            setError("Du måste vara inloggad admin för att se bokningar.");
            setLoading(false);
            return;
        }
    if (user) fetchData();
  }, [user, offset, limit]);

  if (loading) return <p className="p-16">Laddar bokningar...</p>;

  if (error)
    return (
      <div className="p-16">
        <h1 className="text-2xl font-bold">BOOKINGS</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="p-16">
      <h1 className="text-2xl font-bold">Alla bokningar</h1>
  
      {user && <BookingList bookings={bookings} currentUser={{
       id: user.id,
       ispropertyowner: user.ispropertyowner,
       isadmin: user.isadmin
}} />}

<div className="flex justify-between items-center mt-8">
  <button
    onClick={() => {
      if (offset - limit >= 0) {
        setOffset(offset - limit);
      }
    }}
    disabled={offset === 0}
    className={`px-4 py-2 rounded ${offset === 0 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
  >
    Föregående
  </button>

  <p>
    Sida {Math.floor(offset / limit) + 1} av {Math.ceil(count / limit) || 1}
  </p>

  <button
    onClick={() => {
      if (offset + limit < count) {
        setOffset(offset + limit);
      }
    }}
    disabled={offset + limit >= count}
    className={`px-4 py-2 rounded ${offset + limit >= count ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
  >
    Nästa
  </button>
</div>

    </div>
  );
}
