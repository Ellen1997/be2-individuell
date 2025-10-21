

interface NewProperty {
    
    property_name: string;
    description: string;
    location: string;
    pricePerNight: number;
    image_url: string;
    owner_id: string;
}

interface Property extends NewProperty {
    property_id: string;
    created_at: string;
}

type PropertyListQuery = {
    limit?: number;
    offset?: number;
}


type PaginatedListResponse<T> = {
    data: T[];
    count: number;
    limit: number;
    offset: number;
};
