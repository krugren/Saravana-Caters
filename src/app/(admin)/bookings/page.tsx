import { getBookings } from "@/features/bookings/actions";
import BookingsClient from "./bookings-client";

export default async function BookingsPage() {
  const bookingsList = await getBookings();
  return <BookingsClient bookingsList={bookingsList} />;
}
