import { useQuery } from "react-query";
import React, { useState } from "react";
import axiosInstance from "@/utils/hasuraSetup";
import { useSession } from "next-auth/react";
import TeamUsers from "./TeamUsers";
import { format } from "date-fns";

type Team = {
  id: string;
  name: string;
  created_at: string;
  admin: boolean;
};
const MyTeam = () => {
  const { data: session }: any = useSession();
  let userId = session?.user?.id;

  const { isLoading, error, data } = useQuery(
    ["MyQuery", userId],
    async () => {
      const query = `
              query  {
                teams(where: {team_members: {user_id: {_eq: "${userId}"}}}) {
                       id
                       name
                       created_at
                       admin
                       }
              }
          `;
      const response = await axiosInstance.post("", { query });

      return response.data.data;
    },
    {
      enabled: userId ? true : false, // enable the query if userId exists
    }
  );
 const [selectedTeam, setSelectedTeam] = useState<Team | undefined>();


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-5 align-middle rounded-md  ">
      <div className="bg-gradient-to-b from-purple-400 h-1/3  ">
        <h2>My Team</h2>
        <table className="w-full text-white rounded-lg overflow-hidden">
          <thead className="text-left text-sm">
            <tr className="bg-gradient-to-r from-green-400 to-blue-500">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Group Name</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Users</th>
            </tr>
          </thead>
          <tbody>
            {data?.teams.map((item: any) => (
              <tr
                key={item.id}
                className="bg-gradient-to-r from-green-500 to-blue-400 hover:bg-opacity-50 transition-colors duration-500"
              >
                <td className="px-4 py-3 border">{item.id}</td>
                <td className="px-4 py-3 border">{item.name}</td>
                <td className="px-4 py-3 border">{item.admin}</td>
                <td className="px-4 py-3 border">
                  {format(new Date(item.created_at), "MM/dd/yyyy hh:mm:ss a")}
                </td>
                <td className="px-4 py-3 border">
                  <button
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-500"
                    onClick={() => setSelectedTeam(item)}
                  >
                    View Users
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-200 h-1/3 rounded-md w-62  ">
        {selectedTeam && selectedTeam.id && (
          <TeamUsers teamId={selectedTeam.id} />
        )}
      </div>
    </div>
  );
};

export default MyTeam;
