import type { Property } from "../../../../../types/property.js"
import SingleProperty from "@/components/Property/SingleProperty";


type Params = {
    params: Promise<{id: string}>
}

export default async function PropertyPage({params}: Params) {
   const { id } = await params;
   const baseUrl = process.env.BACKEND_BASE_URL;
   const url = `${baseUrl}/properties/${id}/`;
   const response = await fetch(url, {cache: "no-store"});
   const property: Property = await response.json();

   return(
     <div className="p-16">
      <h1 className="text-2xl font-bold mb-4">PROPERTY DETALJ</h1>
      <SingleProperty property={property} />
    </div>
   )
}
