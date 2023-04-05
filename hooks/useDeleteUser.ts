import axiosInstance from "@/utils/hasuraSetup";
import { useMutation, UseMutationResult } from "react-query";

interface DeleteUserResponse {
  delete_user_by_pk: {
    id: number;
  };
}

const useDeleteUser = (): UseMutationResult<
  DeleteUserResponse,
  unknown,
  number
> => {
  const deleteUser = useMutation<DeleteUserResponse, unknown, number>(
 
    (id) => {
      
      const mutation = `
        mutation ($id: Int!) {
          delete_users_by_pk(id: $id) {
            id
          }
        }
      `;
      return axiosInstance.post("", { query: mutation, variables: { id } });
    },
    {
      onSuccess: (data) => {
        const deletedUserId = data.delete_user_by_pk.id;
        alert(`User ${deletedUserId} deleted`);
      },
    }
  );

  return deleteUser;
};

export default useDeleteUser;
