"use client";

import { useUser } from "@/context/UserContext";
import NavLinks from "@/components/navlinks";
import LogoutButton from "@/components/Buttons/logout";

export default function Header() {
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return (
      <header className="sticky top-0 z-100 bg-white shadow-sm p-4">
        <p>Laddar...</p>
      </header>
    );
  }

  if (!user) {
    return (
       <header className="sticky top-0 z-50 w-full shadow-md py-8 px-8 flex justify-between items-center h-18"
      style={{backgroundColor: "rgb(246, 233, 200, 0.8)"}}>
        <h1 className="text-lg font-semibold  text-gray-800">Välkommen!</h1>
        <NavLinks guest />
      </header>
    );
  }

  if (!user.ispropertyowner && !user.isadmin) {
    return (
       <header className="sticky top-0 z-50 w-full shadow-md py-8 px-8 flex justify-between items-center h-16"
      style={{backgroundColor: "rgb(246, 233, 200, 0.8)"}}>
        <h1 className="text-lg font-semibold text-gray-800">Hej {user.name || user.email}!</h1>
        <div className="flex items-center gap-4">
          <NavLinks customer />
          <LogoutButton />
        </div>
      </header>
    );
  }


    if (user.isadmin) {
    return (
       <header className="sticky top-0 z-50 w-full shadow-md py-8 px-8 flex justify-between items-center h-18"
      style={{backgroundColor: "rgb(246, 233, 200, 0.8)"}}>
        <h1 className="text-2xl font-bold  text-gray-800">Adminpanel</h1>
        <div className="flex items-center gap-6">
          <NavLinks admin />
          <LogoutButton />
        </div>
      </header>
    );
  }

  if (user.ispropertyowner) {
    return (
      <header className="sticky top-0 z-50 w-full shadow-md py-8 px-8 flex justify-between items-center h-18"
      style={{backgroundColor: "rgb(246, 233, 200, 0.8)"}}>
        <h1 className="text-lg font-semibold  text-gray-800">Uthyrare</h1>
        <div className="flex items-center gap-4">
          <NavLinks owner />
          <LogoutButton />
        </div>
      </header>
    );
  }

  return null;
}
