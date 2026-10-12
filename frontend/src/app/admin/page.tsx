"use client";

import DeleteProfileButton from "@/components/Buttons/DeleteaccountBtn";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function ProfilePage() {
  const { user, loadingUser } = useUser();

  if (loadingUser) return <p>Laddar...</p>;
  if (!user) return <p>Ingen användare inloggad.</p>;
  if (!user.isadmin) return <p>Endast för administratörer.</p>;

  return (
    <>
      <div className="mt-8"></div>

      <div className="max-w-lg mx-auto p-4 bg-amber-50 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Admin profil</h1>
        <p>
          <strong>Namn:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Telefon:</strong> {user.phone_number}
        </p>

        <Link href={"/profile/mybookings"} className=" font-bold text-blue-800">
          Admins bokningar
        </Link>
        <div className="mt-1"></div>

        <Link href={"/profile/propOwner"} className=" font-bold text-blue-800">
          Admins Uthyrningsobjekt
        </Link>
        <div className="mt-1"></div>

        <Link href={"/properties/new"} className=" font-bold text-blue-800">
          Skapa nytt uthyrningsobjekt
        </Link>
        <div className="mt-1"></div>

        <Link
          href={"/bookings/ownerOfProp"}
          className=" font-bold text-blue-800"
        >
          Bokningar av admins uthyrningsobjekt
        </Link>
        <div className="mt-1"></div>

        <Link href={"/properties"} className=" font-bold text-blue-800">
          Utforska uthyrningsobjekt
        </Link>
        <div className="mt-1"></div>

        <DeleteProfileButton userId={user.id} />
      </div>
    </>
  );
}
