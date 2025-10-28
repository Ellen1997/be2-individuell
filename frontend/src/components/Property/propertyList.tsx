import type { Property} from "../../../../types/property.js"
import Link from "next/link.js"

type PropertyListProps = {
    properties: Property[]
}


export default function PropertyList({properties}: PropertyListProps){
    return(
        <div className="grid gap-4">
            {properties.map((property) => (
                <div key={property.property_id}
                className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white">

                    <div className="flex justify-between items-start">
                        <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                               {property.property_name}
                              </h3>
                              <p className="text-gray-600">{property.description}</p>
                        </div>
                    </div>
             <div className="mt-4 flex gap-4">
                <Link href={`/properties/${property.property_id}`}>
                Detaljsida Property
                </Link>
                <Link
              href={`/bookings/new?propertyId=${property.property_id}`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Boka
            </Link>
             </div>
                </div>
            ) 
            )}
          
        </div>
    )} 
