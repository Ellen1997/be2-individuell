import Link from "next/link.js"
import type { Property } from "../../../../types/property.js"

type SinglePropertyProps = {
    property: Property
}


export default function SingleProperty({property}: SinglePropertyProps ){
    return(
      
    <div className="border rounded-2xl p-6 shadow-md flex flex-col md:flex-row gap-4 text-amber-50 bg-amber-50">
    <div className="flex-1 space-y-2">
    <h2 className="text-2xl font-semibold text-zinc-700">{property.property_name}</h2>
    <p className="text-gray-700">Beskrivning: {property.description}</p>
    <p className="text-gray-700">Plats: {property.location}</p>
    <p className="text-gray-700 font-extrabold">Pris/natt {property.pricePerNight}</p>

    <div className="mt-4 flex gap-4">
      <Link
        href="/properties"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Tillbaka
      </Link>
      <Link
        href={`/bookings/new?propertyId=${property.property_id}`}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Boka
      </Link>
    </div>
  </div>
  {property.image_url && (
    <div className="shrink-0 w-full md:w-64 h-48">
      <img
        src={property.image_url}
        alt={property.property_name}
        className="w-full h-full object-cover rounded"
      />
    </div>
  )}
</div>
    )} 
