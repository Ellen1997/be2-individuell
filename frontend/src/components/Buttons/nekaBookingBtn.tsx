"use client";

import { useState } from "react";

interface DeclineBookingButtonProps {
  bookingId: string;
  onStatusChange?: (status: string) => void;
}

export default function DeclineBookingButton({ bookingId, onStatusChange }: DeclineBookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecline = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      const res = await fetch(`${baseUrl}/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ booking_status: "Declined" }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Misslyckades att neka bokningen.");
      }

      if (onStatusChange) onStatusChange("Declined");
    } catch (err: any) {
      setError(err.message || "Ett fel uppstod.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDecline}
      disabled={loading}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
    >
      {loading ? "Nekar..." : "Neka"}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </button>
  );
}
