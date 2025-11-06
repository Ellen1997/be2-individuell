"use client";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface DeleteProfileButtonProps {
  userId: string;
}

export default function DeleteProfileButton({ userId }: DeleteProfileButtonProps) {
  const { actions } = useUser();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Är du säker på att du vill ta bort ditt konto??")) return;

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
      alert(err.message || "Ett fel uppstod.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white text-sm px-1 py-1 rounded-lg mt-3"
    >
      Radera konto
    </button>
  );
}

