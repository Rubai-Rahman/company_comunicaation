import { useQuery } from "react-query";
import React from "react";
import axiosInstance from "@/utils/hasuraSetup";
import Link from "next/link";

const AllTeam = () => {
  const { isLoading, error, data } = useQuery("MyQuery", async () => {
    const query = `
              query  {
                teams {
                       id
                       name
                       created_at
                       admin
                       }
              }
          `;
    const response = await axiosInstance.post("", { query });

    return response.data.data;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">ID</th>
          <th className="px-4 py-2 text-left">Name</th>
          <th className="px-4 py-2 text-left">Admin</th>
          <th className="px-4 py-2 text-left">Crated_At</th>
        </tr>
      </thead>
      <tbody>
        {data?.teams.map((item: any) => (
          <tr key={item.id}>
            <td className="border px-4 py-2 text-left">{item.id}</td>
            <td className="border px-4 py-2">
              <Link className="text-cyan-400 " href={`/team/${item.id}`}>
                 {item.name}
              </Link>
            </td>
            <td className="border px-4 py-2 text-left">{item.admin}</td>
            <td className="border px-4 py-2 text-left">
              {new Date(item.created_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AllTeam;
