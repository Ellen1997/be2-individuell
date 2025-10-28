import Link from "next/link";
import type { User } from "../../../../types/users.js";

type SingleUserProps = {
    user: User;
}

export default function SingleUser({ user }: SingleUserProps) {
    return (
        <div className="border rounded-2xl p-6 shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2">
                {user.name}
            </h2>
            <p className="text-gray-700 mb-1">Email: {user.email}</p>
            <p className="text-gray-700 mb-1">Phone: {user.phone_number}</p>
            <div>
            <h3 className="text-gray-700 mb-1">Bokningar av denna användare: </h3>
                {user.bookings && user.bookings.length > 0 ? (
          user.bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="border rounded-xl p-3 mb-3 bg-gray-50"
            >
              <p className="text-gray-700 mb-1">
                Property: {booking.properties?.property_name}
              </p>
              <p className="text-gray-700 mb-1">
                Startdatum: {booking.start_date}
              </p>
              <p className="text-gray-700 mb-1">
                Slutdatum: {booking.end_date}
              </p>
              <p className="text-gray-700 mb-1">
                Totalpris: {booking.total_price} kr
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 italic">Inga bokningar hittades.</p>
        )}
      </div>
        
            <Link
                href="/profileusers"
                className="inline-block mt-4 text-blue-600 hover:underline"
            >
                Tillbaka till alla Users
            </Link>
        </div>
    );
}