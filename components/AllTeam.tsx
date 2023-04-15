import { useQuery } from "react-query";
import React from "react";
import axiosInstance from "@/utils/hasuraSetup";
import Link from "next/link";
import Loading from "@/reusecomponents/Loading";

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
    return <Loading />;
  }

  return (
    <table className="table-auto w-2/3 h-auto mb-28 bg-gray-400 mx-auto  rounded-md   ">
      <thead>
        <tr>
          <th className="px-4 py-2  text-justify">Name</th>
          <th className="px-4 py-2  text-justify">Admin</th>
          <th className="px-4 py-2  text-justify">Crated_At</th>
        </tr>
      </thead>
      <tbody>
        {data?.teams.map((item: any) => (
          <tr key={item.id}>
            <td className="border px-4 py-2">
              <Link className="text-white " href={`/team/${item.id}`}>
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
