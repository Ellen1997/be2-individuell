"use client";

import type { User } from "../../../../../types/users.js";
import SingleUser from "@/components/Users/SingleUser";
import Link from "next/link.js";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import React from "react";

type Params = {
  params: Promise<{ id: string }>;
};

export default function ProfileUserPage({ params }: Params) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const { user, actions } = useUser();

  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
          if (user === null) {
            setError("Du måste vara inloggad för att se properties.");
            setLoading(false);
            return;
        }

        if (user === undefined) {
            return;
        }
      try {

        const response = await fetch(`${baseUrl}/api/users/${id}`, {
          credentials: "include", 
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Misslyckades att hämta user");
        }
        const data: User = await response.json();
        setUserDetail(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, user]);

  if (loading) return <p className="p-16">Laddar user...</p>;
  if (error)
    return (
      <div className="p-16">
        <Link href="/" className="text-blue-600 underline">
          Tillbaka till startsidan
        </Link>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );

  if (!userDetail) return <p className="p-16">Ingen user hittades.</p>;

  return (
    <div className="p-16">
      <Link href="/" className="text-blue-600 underline">
        Tillbaka till startsidan
      </Link>
      <h1 className="text-2xl font-bold mb-4">USER DETALJ</h1>
      <SingleUser user={userDetail} />
    </div>
  );
}
