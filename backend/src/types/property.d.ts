id, name, description, location, pricePerNight, availability

interface NewProperty {
    property_id?: string;
    name: string;
    description: string;
    location: string;
    pricePerNight: number;
    availability: string;
}

interface Property extends NewProperty {
    property_id: string;
}

