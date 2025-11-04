import { useMutation } from "@apollo/client/react";
import { CREATE_BOOKING, UPDATE_BOOKING, DELETE_BOOKING } from "../apollo/queries";
import type { CreateBookingData, CreateBookingVars, UpdateBookingData, UpdateBookingVars, DeleteBookingData, DeleteBookingVars } from "../types";

/**
 * Devuelve funciones para create/update/delete.
 * No hace refetch por sí mismo: deja que el consumidor pase refetch si quiere.
 */
export function useBookingMutations() {
  const [createBooking, createState] = useMutation<CreateBookingData, CreateBookingVars>(CREATE_BOOKING);
  const [updateBooking, updateState] = useMutation<UpdateBookingData, UpdateBookingVars>(UPDATE_BOOKING);
  const [deleteBooking, deleteState] = useMutation<DeleteBookingData, DeleteBookingVars>(DELETE_BOOKING);

  return {
    createBooking,
    creating: createState.loading,
    updateBooking,
    updating: updateState.loading,
    deleteBooking,
    deleting: deleteState.loading,
  };
}