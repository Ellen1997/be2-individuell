"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function NewPropertyPage() {
  const router = useRouter();
  const { user, actions } = useUser();


  const [form, setForm] = useState({
    property_name: "",
    description: "",
    location: "",
    pricePerNight: "",
    image_url: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


    useEffect(() => {
    if (user === null) {
      setError("GIT HÄRIFRÅN");
      setLoading(false);
      router.push("/login");
      return;
    } if (user === undefined) {
      return;
    } 
    if (!user.ispropertyowner) {
      setError("Du måste vara property owner för att skapa properties.");
      setLoading(false);
      router.push("/properties");
      return;
    }
  }, [user, actions, router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/properties/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          pricePerNight: Number(form.pricePerNight),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Kunde inte skapa property");
      }

      alert("Property skapades!");
      router.push("/properties");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-md"
      >
        <h1 className="text-xl font-semibold mb-4 text-center">Skapa ny Property</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <label className="block mb-2 text-sm font-medium">Namn</label>
        <input
          type="text"
          name="property_name"
          value={form.property_name}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block mb-2 text-sm font-medium">Beskrivning</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block mb-2 text-sm font-medium">Plats</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block mb-2 text-sm font-medium">Pris per natt (SEK)</label>
        <input
          type="number"
          name="pricePerNight"
          value={form.pricePerNight}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block mb-2 text-sm font-medium">Bild-URL</label>
        <input
          type="url"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          className="w-full border rounded-md p-2 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Skapar..." : "Skapa Property"}
        </button>

        <p className="text-sm mt-4 text-center">
          <a href="/properties" className="text-blue-600 underline">
            Tillbaka till alla properties
          </a>
        </p>
      </form>
    </div>
  );
}
