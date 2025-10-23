

export interface NewProperty {
    
    property_name: string;
    description: string;
    location: string;
    pricePerNight: number;
    image_url: string;
    owner_id: string;
}

export interface Property extends NewProperty {
    property_id: string;
    created_at: string;
}

export type PropertyListQuery = {
    limit?: number;
    offset?: number;
}


