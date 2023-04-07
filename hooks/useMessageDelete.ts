import axiosInstance from "@/utils/hasuraSetup";
import { useMutation, UseMutationResult } from "react-query";

interface DeleteUserResponse {
  delete_user_by_pk: {
    id: number;
  };
}

const useMessageDelete = (): UseMutationResult<
  DeleteUserResponse,
  unknown,
  number
> => {
  const deleteUser = useMutation<DeleteUserResponse, unknown, number>(
    (id) => {
      const mutation = `
        mutation ($id: Int!) {
          delete_messages_by_pk(id: $id) {
            id
          }
        }
      `;
      return axiosInstance.post("", { query: mutation, variables: { id } });
    },
    {
      onSuccess: (data) => {
        alert(`Message deleted`);
      },
    }
  );

  return deleteUser;
};

export default useMessageDelete;
