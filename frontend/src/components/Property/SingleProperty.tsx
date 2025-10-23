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


      <Link
        href="/properties"
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        Tillbaka till alla Properties
      </Link>

    </div>
    )} 
