"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { User } from "../../../../../types/users";

export default function ProfileUsersPage() {
  const { user } = useUser();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    if (!user) {
      setError("Du måste vara inloggad som admin för att se denna sida.");
      setLoading(false);
      return;
    }

    if (!user.isadmin) {
      setError("Endast admin har åtkomst till denna sida.");
      setLoading(false);
      return;
    }

    fetchAllUsers();
  }, [user]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${baseUrl}/api/users`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Kunde inte hämta användare");

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (u: User) => {
    setEditingId(u.profileuser_id);
    setEditForm({
      name: u.name,
      email: u.email,
      phone_number: u.phone_number,
      isadmin: u.isadmin ?? false,
      ispropertyowner: u.ispropertyowner ?? false,
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

      const response = await fetch(`${baseUrl}/auth/authusers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Kunde inte uppdatera användaren");

      await fetchAllUsers();
      cancelEditing();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna användare?")) return;

    try {
      const response = await fetch(`${baseUrl}/auth/authusers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Kunde inte ta bort användaren");

      await fetchAllUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p className="p-8">Laddar användare...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Alla användare</h1>
      {users.length === 0 ? (
        <p>Inga användare hittades.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((u) => (
            <li key={u.profileuser_id} className="border rounded p-4">
              {editingId === u.profileuser_id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="border px-2 py-1 w-full"
                    placeholder="Namn"
                  />
                  <input
                    type="text"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="border px-2 py-1 w-full"
                    placeholder="E-post"
                  />
                  <input
                    type="text"
                    value={editForm.phone_number || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        phone_number: e.target.value,
                      }))
                    }
                    className="border px-2 py-1 w-full"
                    placeholder="Telefonnummer"
                  />
                  <div className="flex items-center gap-2">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!editForm.isadmin}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            isadmin: e.target.checked,
                          }))
                        }
                      />{" "}
                      Admin
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!editForm.ispropertyowner}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            ispropertyowner: e.target.checked,
                          }))
                        }
                      />{" "}
                      Property Owner
                    </label>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => saveEdit(u.profileuser_id)}
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
                  <p className="font-semibold">{u.name}</p>
                  <p>{u.email}</p>
                  <p>{u.phone_number}</p>
                  <p>
                    <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                      {u.isadmin ? "Admin" : "User"}
                    </span>{" "}
                    <span className="text-sm bg-green-100 px-2 py-1 rounded">
                      {u.ispropertyowner ? "Ägare" : "Ej ägare"}
                    </span>
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => startEditing(u)}
                      className="bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      Redigera
                    </button>
                    <button
                      onClick={() => deleteUser(u.profileuser_id)}
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
