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
    <div className="border rounded-lg  bg bg-white shadow-lg   ">
      <ul className="grid grid-cols-2 gap-4 mx-4">
        {data?.team_members.map((member: any) => (
          <li
            key={member?.id}
            className="p-4 rounded-lg shadow-md border m-4  border-gray-300"
          >
            <p className="font-bold text-lg">{member?.user?.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamUsers;
