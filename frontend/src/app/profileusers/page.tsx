import UsersList from "@/components/Users/usersList";
import { User } from "../../../../types/users";
import { PaginatedListResponse } from "../../../../types/general"
import Link from "next/link";

export default async function ProfileUsersPage() {
    const baseUrl = process.env.BACKEND_BASE_URL
    const url = `${baseUrl}/users/`
    const response = await fetch(url)
    const users: PaginatedListResponse<User>= await response.json()
    console.log(users)

    return(
        <div className="p-16">
            <Link href="/" className="text-blue-600 underline">
              Tillbaka till startsidan
            </Link>

            <h1 className="text-2xl font-bold">USERS</h1>
            <UsersList users={users.data} />
        </div>
    )
}