"use client";

import { useState } from "react";

interface DeleteBookingButtonProps {
  bookingId: string;
  onDeleted?: () => void; 
}

export default function DeleteBookingButton({ bookingId, onDeleted }: DeleteBookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Är du säker på att du vill ta bort denna bokning?")) return;

    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      const res = await fetch(`${baseUrl}/api/bookings/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Misslyckades att radera bokningen.");
      }

      if (onDeleted) onDeleted();
    } catch (err: any) {
      setError(err.message || "Ett fel uppstod.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
    >
      {loading ? "Tar bort..." : "Ta bort"}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </button>
  );
}
