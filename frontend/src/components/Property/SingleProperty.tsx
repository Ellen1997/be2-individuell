import Link from "next/link.js"
import type { Property } from "../../../../types/property.js"

type SinglePropertyProps = {
    property: Property
}


export default function SingleProperty({property}: SinglePropertyProps ){
    return(
        <div className="border rounded-2xl p-6 shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-2">
        {property.property_name}
      </h2>
      <p className="text-gray-700 mb-1">Beskrivning: {property.description}</p>
      <p className="text-gray-700 mb-1">Plats: {property.location}</p>
      <p className="text-gray-700 mb-1">Pris/natt {property.pricePerNight}</p>

      <div className="mt-4 flex gap-4">

      <Link
        href="/properties"
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        Tillbaka till alla Properties
      </Link>
       <Link
          href={`/bookings/new?propertyId=${property.property_id}`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Boka
        </Link>

        </div>

    </div>
    )} 
