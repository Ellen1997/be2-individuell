"use client";

import { useUser } from "@/context/UserContext";
import NavLinks from "@/components/navlinks";
import LogoutButton from "@/components/Buttons/logout";

export default function Header() {
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm p-4">
        <p>Laddar...</p>
      </header>
    );
  }

  if (!user) {
    return (
      <header className="sticky top-0 z-50 bg-gray-100 shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Välkommen!</h1>
        <NavLinks guest />
      </header>
    );
  }

  if (!user.ispropertyowner && !user.isadmin) {
    return (
      <header className="sticky top-0 z-50 bg-blue-100 shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Hej {user.name || user.email}</h1>
        <div className="flex items-center gap-4">
          <NavLinks customer />
          <LogoutButton />
        </div>
      </header>
    );
  }

  if (user.isadmin) {
    return (
      <header className="sticky top-0 z-50 bg-red-100 shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Adminpanel</h1>
        <div className="flex items-center gap-4">
          <NavLinks admin />
          <LogoutButton />
        </div>
      </header>
    );
  }

  if (user.ispropertyowner) {
    return (
      <header className="sticky top-0 z-50 bg-green-100 shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Hej {user.name} PROPOWNER</h1>
        <div className="flex items-center gap-4">
          <NavLinks owner />
          <LogoutButton />
        </div>
      </header>
    );
  }

  return null;
}
