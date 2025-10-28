import type { User } from "../../../../types/users.js"
import Link from "next/link.js"

type UsersListProps = {
    users: User[]
}

export default function UsersList({users}: UsersListProps){
    return(
        <div className="grid gap-4">
            {users.map((user) => (
                <div key={user.profileuser_id}
                className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                {user.name}
                                </h3>
                                <p className="text-gray-600">{user.email}</p>
                        </div>
                    </div>
                <div>
                     <Link href={`/profileusers/${user.profileuser_id}`}>
                     Detaljsida User
                     </Link>
                </div>
                </div>
            )
            )}
            </div>
    )}
