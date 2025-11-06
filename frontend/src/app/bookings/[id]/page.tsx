"use client";

import type { Booking } from "../../../../../types/bookings";
import SingleBooking from "@/components/Bookings/SingleBooking";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default function BookingPage({ params }: Props) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const { user, actions } = useUser();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
        if (user === null) {
            setError("Du måste vara inloggad för att se bokningar.");
            setLoading(false);
            return;
        }

        if (user === undefined) {
            return;
        }


      try {

        const response = await fetch(`${baseUrl}/api/bookings/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Misslyckades att hämta bokningen");
        }

        const data: Booking = await response.json();
        setBooking(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, user]);

  if (loading) return <p>Laddar bokning...</p>;

  if (error)
    return (
      <div className="p-16">
        <p className="text-red-600 mt-4">{error}</p>
      </div>
    );

  if (!booking) return null;

  return (
    <div className="p-16">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">BOKNINGS DETALJ</h1>
      <SingleBooking booking={booking} />
      <div className="mt-4"></div>

         <button
      onClick={() => router.back()}
      className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
    >
      Tillbaka
    </button>
    </div>
  );
}
