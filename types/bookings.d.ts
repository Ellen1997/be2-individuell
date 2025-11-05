 export interface Booking {
  booking_id: string;
  property_id: string;
  profileuser_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  created_at: string;
  booking_status: string;
  properties?: {
    property_name: string;
    location: string;
    pricePerNight: number;
    owner_id: string;
    profileusers?: {
      name:string; 
    }
  };
  profileusers?: {
    name: string;
    email: string;
    phone_number?: string;
  };
}

 export interface NewBooking {
  property_id: string;
  profileuser_id: string;
  start_date: string;
  end_date: string;
}

export type BookingListQuery = {
    limit?: number;
    offset?: number;
}


