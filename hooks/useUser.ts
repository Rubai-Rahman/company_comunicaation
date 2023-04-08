import axiosInstance from "@/utils/hasuraSetup";
import { useQuery } from "react-query";

export const useUser = () => {
  
  return useQuery(
    "users",
    async () => {
      const query = `
      query  {
        users {
          name,
          email,
          password,
          role,
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

        
        // queryClient.invalidateQueries("users");
        //queryClient.invalidateQueries("user");
      },
    }
  );
};
