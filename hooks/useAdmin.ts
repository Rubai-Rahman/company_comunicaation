import axiosInstance from "@/utils/hasuraSetup";
import { useQuery, useQueryClient } from "react-query";

export const useAdmin = () => {
  const queryClient = useQueryClient();
  return useQuery(
    "users",
    async () => {
      const query = `
      query  {
        users(where: {role: {_eq: "administrator"}}) {
    email
    name
    password
    role
    id
  }
      }
    `;
      const response = await axiosInstance.post("", { query });
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      return response.data.data.users;
    },
    {
      onSuccess: () => {
        // Invalidate dependent queries on success

        console.log("data fetching ");
        // queryClient.invalidateQueries("users");
        //queryClient.invalidateQueries("user");
      },
    }
  );
};
