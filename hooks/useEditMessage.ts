import axios from "axios";
import { useSession } from "next-auth/react";
import { useMutation } from "react-query";

const baseURL: any = process.env.hasuraEndPoint;
const hasurasecret: any = process.env.hasuraSecret;

const useEditMessage = (): any => {
  const { data: session, status }: any = useSession();
  let token = session?.jwtToken;

  const editMessage = useMutation(
    (requestData: any) => {
      return axios.post(
        baseURL,
        {
          query: `mutation MyMutation($id: Int!, $message: String = "") {
  update_messages_by_pk(pk_columns: {id: $id}, _set: {message: $message}) {
    message
    id
    created_at
    user_id
  }
}`,
          variables: {
            id: requestData.editingMessage,
            message: requestData.editedMessage,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
             "x-hasura-admin-secret": hasurasecret,
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: () => {},
    }
  );

  return editMessage;
};

export default useEditMessage;
