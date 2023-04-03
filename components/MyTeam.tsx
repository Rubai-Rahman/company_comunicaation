import { useQuery } from "react-query";
import React from "react";
import axiosInstance from "@/utils/hasuraSetup";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-b from-purple-400 to-pink-500">
      <h2>My Team</h2>
      <table className="w-full text-white rounded-lg overflow-hidden">
        <thead className="text-left text-sm">
          <tr className="bg-gradient-to-r from-green-400 to-blue-500">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Admin</th>
            <th className="px-4 py-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data?.teams.map((item: any) => (
            <tr
              key={item.id}
              className="bg-gradient-to-r from-green-500 to-blue-400 hover:bg-opacity-50 transition-colors duration-500"
            >
              <td className="px-4 py-3 border">{item.id}</td>
              <td className="px-4 py-3 border">
                <Link
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-500"
                  href={`/team/${item.id}`}
                >
                  {item.name}
                </Link>
              </td>
              <td className="px-4 py-3 border">{item.admin}</td>
              <td className="px-4 py-3 border">
                {new Date(item.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap");

        body {
          font-family: "Montserrat", sans-serif;
        }
      `}</style>
    </div>
  );
};

export default MyTeam;
