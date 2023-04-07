import axiosInstance from "@/utils/hasuraSetup";
import { useQuery, useQueryClient } from "react-query";

export const useAdmin = () => {
  const queryClient = useQueryClient();
  return useQuery(
    "users",
    async () => {
      const query = `
     query MyQuery {
  users(where: {role: {_eq: "administrator"}}) {
    email
    id
    name
    password
    role
  }
}

    `;
      const response = await axiosInstance.post("", { query });

      return response.data.data;
    },

    {
      onSuccess: () => {
        // Invalidate dependent queries on success
        //queryClient.invalidateQueries("users");
        // queryClient.invalidateQueries("user");
      },
    }
  );
};
