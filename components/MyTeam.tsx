import { useQuery } from "react-query";
import React, { useState } from "react";
import axiosInstance from "@/utils/hasuraSetup";
import { useSession } from "next-auth/react";
import TeamUsers from "./TeamUsers";
import { format } from "date-fns";
import Chat from "./Chat";
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
    <div className="grid grid-cols-3 gap-5 align-middle rounded-md mt-4 p-4  bg-slate-300 h-screen">
      <div className="bg-slate-400 h-[550px]  p-4 rounded-lg  ">
        <table className="w-full text-white rounded-lg overflow-hidden">
          <thead className="text-left text-sm">
            <tr className="bg-gradient-to-r from-green-400 to-blue-500">
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
                <td className="px-4 py-3 border">{item.name}</td>
                <td className="px-4 py-3 border">{item.admin}</td>
                <td className="px-4 py-3 border">
                  {format(
                    new Date(item.created_at),
                    "MMMM dd, yyyy hh:mm:ss a"
                  )}
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
      <div className="col-span-2	">
        {selectedTeam && selectedTeam.id && (
          <div className="grid grid-cols-2 gap-4	  ">
            <div className="bg-slate-400   p-4 rounded-lg ">
              <TeamUsers teamId={selectedTeam.id} />
            </div>
            <div className="bg-slate-400 h-[550px]    p-4 rounded-lg ">
              <Chat teamId={selectedTeam.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
