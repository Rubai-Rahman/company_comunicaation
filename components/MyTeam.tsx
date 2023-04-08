import { useQuery } from "react-query";
import React, { useState } from "react";
import axiosInstance from "@/utils/hasuraSetup";
import { useSession } from "next-auth/react";
import TeamUsers from "./TeamUsers";
import { format } from "date-fns";
import Chat from "./Chat";
import Link from "next/link";
type Team = {
  id: string;
  name: string;
  created_at: string;
  admin: boolean;
};
const MyTeam = () => {
  const { data: session }: any = useSession();
  let userId = session?.user?.id;
  let role = session?.user?.role;
  const userRole = "member";
  const isLinkDisabled = userRole === role;

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
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1  gap-5 align-middle rounded-md  p-4  bg-slate-300 h-screen md:grid-cols-1 lg:grid-cols-3  ">
      <div className="bg-slate-400 h-[550px]  p-4 rounded-lg overflow-scroll   overflow-x-hidden ">
        <h1 className="bg-slate-800 text-white p-4 mb-1  text-center text-xl rounded-md shadow-sm">
          My Group{""}
        </h1>
        <table className=" text-black rounded-lg overflow-scroll     bg-slate-200 ">
          <thead className="text-left text-sm">
            <tr className="">
              <th className="px-2 py-3">Group Name</th>
              <th className="px-2 py-3">Admin</th>
              <th className="px-2 py-3">Created At</th>
              <th className="px-2 py-3">Users</th>
            </tr>
          </thead>
          <tbody>
            {data?.teams.map((item: any) => (
              <tr key={item.id} className="overflow-scroll  ">
                <td className="px-2 py-3 border">
                  {isLinkDisabled ? (
                    <p className="text-gray-500 ">{item.name}</p>
                  ) : (
                    <Link className="text-cyan-500 " href={`/team/${item.id}`}>
                      {item.name}
                    </Link>
                  )}
                </td>
                <td className="px-2 py-3 border">{item.admin}</td>
                <td className="px-2 py-3 border text-xs">
                  {format(
                    new Date(item.created_at),
                    "MMMM dd, yyyy hh:mm:ss a"
                  )}
                </td>
                <td className="px-4 py-3 border">
                  <button
                    className="text-cyan-500 hover:text-cyan-300 transition-colors duration-500"
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
              <h1 className="bg-slate-800 text-white p-4 mb-1  text-center text-xl rounded-md shadow-sm     ">
                Group Members
              </h1>
              <TeamUsers teamId={selectedTeam.id} />
            </div>
            <div className="bg-slate-400 h-[550px]    p-4 rounded-lg ">
              <h1 className="bg-slate-800 text-white p-4 mb-1  text-center text-xl rounded-md shadow-sm     ">
                Chat
              </h1>
              <Chat teamId={selectedTeam.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
