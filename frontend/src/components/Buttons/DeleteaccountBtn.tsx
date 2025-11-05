"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface DeleteProfileButtonProps {
  userId: string;
}

export default function DeleteProfileButton({ userId }: DeleteProfileButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { actions } = useUser();

  const handleDelete = async () => {
    if (!confirm("Är du säker på att du vill ta bort ditt konto?")) return;

    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      const res = await fetch(`${baseUrl}/auth/authusers/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Misslyckades att radera profilen.");
      }

      await actions.logout();

      router.push("/login");
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
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-4"
    >
      {loading ? "Tar bort..." : "Ta bort mitt konto"}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </button>
  );
}
