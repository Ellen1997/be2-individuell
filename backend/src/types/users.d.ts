

interface NewUser {
    name: string;
    email: string;
    phone_number: string;
    isadmin?: boolean;
    isPropertyOwner?: boolean;
}

interface User extends NewUser {
    profileuser_id: string;
}


type UserListQuery = {
    limit?: number;
    offset?: number;
}


type PaginatedListResponse<T> = {
    data: T[];
    count: number;
    limit: number;
    offset: number;
};

