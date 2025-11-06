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
                className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow bg-amber-50">

                    <div className="flex justify-between items-start">
                        <div>
                              <h3 className="text-2xl font-semibold text-gray-700">
                               {property.property_name}
                              </h3>
                              <p className="text-gray-600 text-sm">{property.description}</p>
                              {property.image_url && (
                            <img
                                src={property.image_url}
                                alt={property.property_name}
                                className="w-full h-50 object-cover rounded"
                                 />
              )}
                        </div>
                    </div>
             <div className="mt-4 flex gap-4 ">
                <Link href={`/properties/${property.property_id}`}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
                Detaljsida Property
                </Link>
                <Link
              href={`/bookings/new?propertyId=${property.property_id}`}
              className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Boka
            </Link>
             </div>
                </div>
            ) 
            )}
          
        </div>
    )} 
