import axiosInstance from "@/utils/hasuraSetup";
import { useMutation, UseMutationResult } from "react-query";

interface EditUserResponse {
  update_users_by_pk: {
    id: number | string;
    name: string;
    email: string;
    password: string;
  };
}
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const useEditSingleUser = (): UseMutationResult<
  EditUserResponse,
  unknown,
  User
  // { id: number; name: string; email: string; password: string }
> => {
  const editUser = useMutation<
    EditUserResponse,
    unknown,
    User
    //{ id: number; name: string; email: string; password: string }
  >(
    (formData) => {
      console.log("hooks",formData);
      const mutation = `
        mutation ($id: Int!, $name: String!, $email: String!, $password: String!) {
          update_users_by_pk(pk_columns: {id: $id}, _set: {name: $name, email: $email, password: $password}) {
            id
            name
            email
            
          }
        }
      `;
      const { id, name, email, password } = formData;
      return axiosInstance.post("", {
        query: mutation,
        variables: { id, name, email, password },
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

export default useEditSingleUser;
