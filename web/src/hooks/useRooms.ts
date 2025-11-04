import { useQuery } from "@apollo/client/react";
import type { RoomsData } from "../types";
import { ROOMS } from "../apollo/queries";


export function useRooms() {
  const res = useQuery<RoomsData>(ROOMS);
  return res;
}