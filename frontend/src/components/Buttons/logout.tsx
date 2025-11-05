"use client";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { actions } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3003/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Logout failed:", await res.text());
        return;
      }

      actions.logout(); 
      alert("Logged out!");
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Logga ut
    </button>
  );
}
