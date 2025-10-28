import type { User } from "../../../../../types/users.js"
import SingleUser from "@/components/Users/SingleUser";
import Link from "next/link.js";

type Params = {
    params: Promise<{id: string}>
}   

export default async function ProfileUserPage({params}: Params) {
    const { id } = await params;
    const baseUrl = process.env.BACKEND_BASE_URL;
    const url = `${baseUrl}/users/${id}/`;
    const response = await fetch(url, {cache: "no-store"});
    const user: User = await response.json();

    return(
      <div className="p-16">
        <Link href="/" className="text-blue-600 underline">
              Tillbaka till startsidan
            </Link>
       <h1 className="text-2xl font-bold mb-4">USER DETALJ</h1>
         <SingleUser user={user} />
        </div>
    )
};