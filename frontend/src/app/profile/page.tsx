"use client";

import { useEffect, useState } from "react";
import DeleteProfileButton from "@/components/Buttons/DeleteaccountBtn";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveUser = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const res = await fetch(`${baseUrl}/auth/activeUser`, {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Kunde inte hämta användare:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveUser();
  }, []);

  if (loading) return <p>Laddar...</p>;
  if (!user) return <p>Ingen användare inloggad.</p>;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Min profil</h1>
      <p><strong>Namn:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Telefon:</strong> {user.phone_number}</p>

      <Link
      href={"/profile/mybookings"}>Mina bokningar</Link>
    




      <DeleteProfileButton userId={user.id} />
    </div>
  );
}




