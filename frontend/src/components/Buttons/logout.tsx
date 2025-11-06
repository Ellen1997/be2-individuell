"use client";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { actions } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await actions.logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-2 py-1 bg-red-900 text-white rounded-lg hover:bg-red-700"
    >
      Logga ut
    </button>
  );
}

