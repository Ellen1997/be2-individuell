"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Property } from "../../../../../types/property";

export default function PropertyAdminPage() {
  const { user } = useUser();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Property>>({});

  useEffect(() => {
    if (!user) {
       setError("Du måste vara inloggad som admin för att se denna sida.");
      setLoading(false);
      return;
    } 

        if (!user.isadmin) {
      setError("Du måste vara admin för att se denna sida.");
      setLoading(false);
      return;
    }
      
      
      fetchAllProperties();
  }, [user]);

  const fetchAllProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${baseUrl}/api/properties`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Kunde inte hämta alla properties");

      const data = await response.json();
      setProperties(Array.isArray(data) ? data : data.data || data.properties || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (property: Property) => {
    setEditingId(property.property_id);
    setEditForm({
      property_name: property.property_name,
      description: property.description,
      location: property.location,
      pricePerNight: property.pricePerNight,
      image_url: property.image_url,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    try {

        const payload = Object.fromEntries(
        Object.entries(editForm).filter(([_, v]) => v !== undefined)
         );

      const response = await fetch(`${baseUrl}/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Kunde inte spara ändringar");

      await fetchAllProperties();
      cancelEditing();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna property?")) return;

    try {
      const response = await fetch(`${baseUrl}/api/properties/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Kunde inte ta bort property");

      await fetchAllProperties();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Laddar alla properties...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Alla Properties</h1>
      {properties.length === 0 ? (
        <p>Det finns inga properties ännu.</p>
      ) : (
        <ul className="space-y-4">
          {properties.map((p) => (
            <li key={p.property_id} className="border rounded p-4">
              {editingId === p.property_id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.property_name || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, property_name: e.target.value }))
                    }
                    className="border px-2 py-1 w-full"
                    placeholder="Namn"
                  />
                  <input
                    type="text"
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="border px-2 py-1 w-full"
                    placeholder="Beskrivning"
                  />
                  <input
                    type="text"
                    value={editForm.location || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, location: e.target.value }))
                    }
                    className="border px-2 py-1 w-full"
                    placeholder="Plats"
                  />
                  <input
                    type="number"
                    value={editForm.pricePerNight || 0}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        pricePerNight: Number(e.target.value),
                      }))
                    }
                    className="border px-2 py-1 w-full"
                    placeholder="Pris per natt"
                  />
                  <input
                    type="text"
                    value={editForm.image_url || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, image_url: e.target.value }))
                    }
                    className="border px-2 py-1 w-full"
                    placeholder="Bild URL"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => saveEdit(p.property_id)}
                      className="bg-green-600 text-white px-4 py-1 rounded"
                    >
                      Spara
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-300 px-4 py-1 rounded"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-semibold">{p.property_name}</p>
                  <p>{p.location}</p>
                  <p>{p.description}</p>
                  <p>{p.pricePerNight} kr/natt</p>
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.property_name}
                      className="w-64 h-40 object-cover rounded"
                    />
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => startEditing(p)}
                      className="bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      Redigera
                    </button>
                    <button
                      onClick={() => deleteProperty(p.property_id)}
                      className="bg-red-600 text-white px-4 py-1 rounded"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}