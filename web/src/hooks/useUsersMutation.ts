import { useMutation } from "@apollo/client/react";
import { CREATE_USER, UPDATE_USER, DELETE_USER } from "../apollo/queries";
import type { CreateUserData, CreateUserVars, UpdateUserData, UpdateUserVars, DeleteUserData, DeleteUserVars } from "../types";

export function useUserMutations() {
  const [createUser, createState] = useMutation<CreateUserData, CreateUserVars>(CREATE_USER);
  const [updateUser, updateState] = useMutation<UpdateUserData, UpdateUserVars>(UPDATE_USER);
  const [deleteUser, deleteState] = useMutation<DeleteUserData, DeleteUserVars>(DELETE_USER);

  return {
    createUser,
    creating: createState.loading,
    updateUser,
    updating: updateState.loading,
    deleteUser,
    deleting: deleteState.loading,
  };
}