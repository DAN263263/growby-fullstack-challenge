import { useQuery } from "@apollo/client/react";
import type { UsersData } from "../types";
import { USERS } from "../apollo/queries";


export function useUsers() {
  const res = useQuery<UsersData>(USERS);
  return res;
}