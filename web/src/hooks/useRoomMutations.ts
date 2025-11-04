import { useMutation } from "@apollo/client/react";
import { CREATE_ROOM, UPDATE_ROOM, DELETE_ROOM } from "../apollo/queries";
import type { CreateRoomData, CreateRoomVars, UpdateRoomData, UpdateRoomVars, DeleteRoomData, DeleteRoomVars } from "../types";

export function useRoomMutations() {
  const [createRoom, createState] = useMutation<CreateRoomData, CreateRoomVars>(CREATE_ROOM);
  const [updateRoom, updateState] = useMutation<UpdateRoomData, UpdateRoomVars>(UPDATE_ROOM);
  const [deleteRoom, deleteState] = useMutation<DeleteRoomData, DeleteRoomVars>(DELETE_ROOM);

  return {
    createRoom,
    creating: createState.loading,
    updateRoom,
    updating: updateState.loading,
    deleteRoom,
    deleting: deleteState.loading,
  };
}