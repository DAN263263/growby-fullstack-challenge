import { useQuery } from "@apollo/client/react";
import type { BookingsData, BookingsVars } from "../types";
import { BOOKINGS } from "../apollo/queries";


export function useBookings(roomId: string | undefined) {
  const res = useQuery<BookingsData, BookingsVars>(BOOKINGS, {
    variables: { roomId: roomId || "" },
    fetchPolicy: "cache-and-network"
  });
  return res;
}