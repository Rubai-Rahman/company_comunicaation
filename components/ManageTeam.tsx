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
console.log(data);
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
    return <div>Loading...</div>;
  }

  return (
    <table className="table-auto w-full border-collapse">
      <thead className="bg-gray-800">
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
      <tbody>
        {data?.teams.map((item: any) => (
          <tr
            key={item.id}
            className="bg-gray-300 border-collapse shadow-sm mb-3  "
          >
            <td className="px-4 py-2 text-center text-xl ">{item.name}</td>
            <td className="px-4 py-2 text-center">
              <Link className="text-cyan-400" href={`/team/${item.id}`}>
                <button className="bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 hover:from-green-400 hover:via-teal-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                  Add Participant
                </button>
              </Link>
            </td>
            <td className="px-4 py-2 text-center">
              <Link className="text-cyan-400" href={`/team/${item.id}`}>
                <button className="bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 hover:from-green-400 hover:via-teal-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                  Remove Participant
                </button>
              </Link>
            </td>
            <td className="px-4 py-2 text-center">
              <button
                className="bg-gradient-to-r from-yellow-400 to-red-500 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ManageTeam;
