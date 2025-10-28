import PropertyList from "@/components/Property/propertyList";
import { Property } from "../../../../types/property";
import { PaginatedListResponse } from "../../../../types/general"
import Link from "next/link";

export default async function Home() {
  const baseUrl = process.env.BACKEND_BASE_URL
  const url = `${baseUrl}/properties/`
  const response = await fetch(url)
  const propertys: PaginatedListResponse<Property>= await response.json()
  console.log(propertys)

  return(
    <div className="p-16">
        <Link href="/" className="text-blue-600 underline">
              Tillbaka till startsidan
            </Link>
        <h1 className="text-2xl font-bold">PROPERTY</h1>
        <PropertyList properties={propertys.data} />
    </div>

  )
}

