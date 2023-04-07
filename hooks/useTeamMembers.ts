import axiosInstance from "@/utils/hasuraSetup";
import { useQuery, useQueryClient } from "react-query";

export const useTeamMembers = (teamId: any) => {
  const queryClient = useQueryClient();
  return useQuery(
    ["TeamUsersQuery", teamId],
    async () => {
      const query = `
              query  {
                team_members(where: {team_id: {_eq: "${teamId}"}}) {
                       id
                       user {
                        id
                         name
                         email
                         role
                       }
                       }
              }
          `;
      const response = await axiosInstance.post("", { query });

      return response.data.data;
    },
    {
      enabled: teamId ? true : false, // enable the query if teamId exists
    }
  );
};
