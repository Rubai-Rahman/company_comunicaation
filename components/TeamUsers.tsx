import { useQuery } from "react-query";
import React from "react";
import axiosInstance from "@/utils/hasuraSetup";

const TeamUsers = ({ teamId }: any) => {
  const { isLoading, error, data } = useQuery(
    ["TeamUsersQuery", teamId],
    async () => {
      const query = `
              query  {
                team_members(where: {team_id: {_eq: "${teamId}"}}) {
                       id
                       user {
                         name
                         email
                       }
                       }
              }
          `;
      const response = await axiosInstance.post("", { query });

      return response.data.data;
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul className="grid grid-cols-2 gap-4 mx-4">
        {data?.team_members.map((member: any) => (
          <li
            key={member?.id}
            className="p-4 rounded-lg shadow-md border border-gray-300"
          >
            <p className="font-bold text-lg">{member?.user?.name}</p>
            <p className="text-gray-500">{member?.user?.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamUsers;
