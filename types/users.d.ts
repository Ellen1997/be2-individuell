

export interface NewUser {
    name: string;
    email: string;
    phone_number: string;
    isadmin?: boolean;
    isPropertyOwner?: boolean;
}

export interface User extends NewUser {
    profileuser_id: string;
}


export type UserListQuery = {
    limit?: number;
    offset?: number;
}


