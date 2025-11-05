"use client";

import { useState } from "react";

interface AcceptBookingButtonProps {
  bookingId: string;
  onStatusChange?: (status: string) => void;
}

export default function AcceptBookingButton({ bookingId, onStatusChange }: AcceptBookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      const res = await fetch(`${baseUrl}/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ booking_status: "Accepted" }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Misslyckades att acceptera bokningen.");
      }

      if (onStatusChange) onStatusChange("Accepted");
    } catch (err: any) {
      setError(err.message || "Ett fel uppstod.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAccept}
      disabled={loading}
      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
    >
      {loading ? "Accepterar..." : "Acceptera"}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </button>
  );
}