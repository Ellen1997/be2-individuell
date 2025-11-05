

export interface NewUser {
    name: string;
    email: string;
    phone_number: string;
    isadmin?: boolean;
    ispropertyowner?: boolean;
    bookings?: {
        booking_id?: string,
        start_date?: string,
        end_date?: string,
        total_price?: number,
        properties?: {
            property_name?: string;
        } 
    }[];
}

export interface User extends NewUser {
    profileuser_id: string;
}


export type UserListQuery = {
    limit?: number;
    offset?: number;
}


