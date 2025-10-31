"use client";

import { useState,useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId") ?? "";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, actions } = useUser();


  if (!propertyId) {
    return <p>Ingen property vald.</p>;
  }

  useEffect(() => {
    if (user === null) {
      setError("GIT HÄRIFRÅN");
      setLoading(false);
      router.push("/login");
      return;
    } if (user === undefined) {
      return;
    } 
  }, [user, actions, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3003/api/v1/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
          property_id: propertyId,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Misslyckades med bokningen");
      }


      router.push("/bookings");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Boka denna bostad</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Startdatum:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="border rounded px-2 py-1 w-full"
          />
        </label>
        <label>
          Slutdatum:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="border rounded px-2 py-1 w-full"
          />
        </label>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Bokar..." : "Boka"}
        </button>
      </form>
    </div>
  );
}
