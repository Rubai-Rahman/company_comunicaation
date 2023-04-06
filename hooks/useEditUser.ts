import axiosInstance from "@/utils/hasuraSetup";
import { useMutation, UseMutationResult } from "react-query";

interface EditUserResponse {
  update_users_by_pk: {
    id: number |string;
    name: string;
    email: string;
    role: string;
  };
}

const useEditUser = (): UseMutationResult<
  EditUserResponse,
  unknown,
  { id: number; name: string; email: string; role: string }
> => {
  const editUser = useMutation<
    EditUserResponse,
    unknown,
    { id: number; name: string; email: string; role: string }
  >(
    ({ id, name, email, role }) => {
      const mutation = `
        mutation ($id: Int!, $name: String!, $email: String!, $role: String!) {
          update_users_by_pk(pk_columns: {id: $id}, _set: {name: $name, email: $email, role: $role}) {
            id
            name
            email
            role
          }
        }
      `;
      return axiosInstance.post("", {
        query: mutation,
        variables: { id, name, email, role },
      });
    },
    {
      onSuccess: (data) => {
        const editedUser = data.update_users_by_pk;
        alert(`User updated`);
      },
    }
  );

  return editUser;
};

export default useEditUser;
