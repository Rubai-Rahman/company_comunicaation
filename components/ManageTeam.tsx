import { useQuery, useMutation } from "react-query";
import React from "react";
import axiosInstance from "@/utils/hasuraSetup";
import Link from "next/link";

const ManageTeam = () => {
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

  const deleteTeam = useMutation(
    (id: number) => {
      const mutation = `
          mutation ($id: Int!) {
            delete_teams_by_pk(id: $id) {
              id
            }
          }
      `;
      return axiosInstance.post("", { query: mutation, variables: { id } });
    },
    {
      onSuccess: (data) => {
        alert("Team Deleted ");
      },
    }
  );

  const handleDelete = (id: number) => {
    deleteTeam.mutate(id);
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-600 h-screen ">
      <table className="table-auto w-full ">
        <thead className="bg-gray-800 mt-10 ">
          <tr className="border-collapse">
            <th className="px-4 py-2 text-center text-white border-0">Name</th>
            <th className="px-4 py-2 text-center text-white border-0">
              Add Participant
            </th>
            <th className="px-4 py-2 text-center text-white border-0">
              Remove Participant
            </th>
            <th className="px-4 py-2 text-center text-white border-0">
              Delete Team
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-400 shadow-sm pb-28  ">
          {data?.teams.map((item: any) => (
            <tr key={item.id}>
              <td className="px-4 py-2 text-center text-xl ">{item.name}</td>
              <td className="px-4 py-2 text-center">
                <Link className="text-cyan-400" href={`/team/${item.id}`}>
                  <button className=" ring-2 ring-gray-800 text-gray-700 hover:text-white    hover:bg-gray-700  font-bold py-2 px-4 rounded">
                    Add Participant
                  </button>
                </Link>
              </td>
              <td className="px-4 py-2 text-center">
                <Link className="text-cyan-400" href={`/team/${item.id}`}>
                  <button className=" ring-2 ring-gray-800 text-gray-700 hover:text-white    hover:bg-[#FF0303]  font-bold py-2 px-4 rounded">
                    Remove Participant
                  </button>
                </Link>
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  className=" ring-2 ring-red-500 text-gray-700 hover:text-white    hover:bg-[#FF0303]  font-bold py-2 px-4 rounded"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTeam;
