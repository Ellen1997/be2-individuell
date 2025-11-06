"use client";

import { useEffect, useState } from "react";
import UsersList from "@/components/Users/usersList";
import { User } from "../../../../types/users";
import { PaginatedListResponse } from "../../../../types/general"
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function ProfileUsersPage() {
   const { user, actions } = useUser();
    const [profileusers, setprofileUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        if (user === null) {
            setError("Du måste vara inloggad admin för att se profiles.");
            setLoading(false);
            return;
        }

        if (user === undefined) {
            return;
        }
        try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const url = `${baseUrl}/api/users/`
    const response = await fetch(url, {
        credentials: "include"
    })

         if (!response.ok)  {
          const text = await response.text();
          throw new Error(text || "Misslyckades att hämta profiler");
        }

        const users: PaginatedListResponse<User>= await response.json();
        setprofileUsers(users.data);
      } catch (err: any) {
        setError(err.message || "Kunde inte hämta profiler.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, actions]);

  if (loading) return <p className="p-16">Laddar users...</p>;
  if (error) 
    return (
      <div className="p-16">
        <Link href="/" className="text-blue-600 underline">
          Tillbaka till startsidan
        </Link>
        <h1 className="text-2xl font-bold">USERS</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );

    return(
        <div className="p-16">

            <h1 className="text-2xl font-bold">Användare</h1>
            <UsersList users={profileusers} />
        </div>
    )
}