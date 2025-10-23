 interface Booking {
  booking_id: string;
  property_id: string;
  profileuser_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  created_at: string;
  properties?: {
    property_name: string;
    location: string;
    pricePerNight: number;
  };
  profileusers?: {
    name: string;
    email: string;
    phone_number?: string;
  };
}

 interface NewBooking {
  property_id: string;
  profileuser_id: string;
  start_date: string;
  end_date: string;
}

type BookingListQuery = {
    limit?: number;
    offset?: number;
}


type PaginatedListResponse<T> = {
    data: T[];
    count: number;
    limit: number;
    offset: number;
};
