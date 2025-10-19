
interface NewBooking {
    booking_id?: string;
    creatdedAt: Date.now;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
}

interface Booking extends NewBooking {
    booking_id: string;
}

