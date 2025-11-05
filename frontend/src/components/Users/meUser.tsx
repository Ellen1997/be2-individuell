import type { User } from "../../../../types/users.js";
import Link from "next/link.js";

type SingleUserProps = {
    user: User;
}

export default function MeUser({ user }: SingleUserProps) {
    return (
        <div className="border rounded-2xl p-6 shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2">
                {user.name}
            </h2>
            <p className="text-gray-700 mb-1">Email: {user.email}</p>
            <p className="text-gray-700 mb-1">Phone: {user.phone_number}</p>
               <Link
                href="/profile/mybookings"
                className="inline-block mt-4 text-blue-600 hover:underline">Mina bokningar</Link>

            </div>

    )}