import axiosInstance from "@/utils/hasuraSetup";
import { useMutation } from "react-query";

const useEditMessage = (): any => {
  const editMessage = useMutation(
    (requestData: any) => {
      return axiosInstance.post("", {
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
      });
    },
    {
      onSuccess: () => {},
    }
  );

  return editMessage;
};

export default useEditMessage;
