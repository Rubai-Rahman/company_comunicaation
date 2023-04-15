import { useQuery, useMutation } from "react-query";
import React from "react";
import axiosInstance from "@/utils/hasuraSetup";
import Link from "next/link";
import Loading from "@/reusecomponents/Loading";

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
    return <Loading />;
  }

  return (
    <div className="bg-gray-600 h-screen ">
      <table className="table-auto w-full ">
        <thead className="bg-gray-800 mt-10 ">
          <tr className="border-collapse">
            <th>Name</th>
            <th>Add Participant</th>
            <th>Remove Participant</th>
            <th>Delete Team</th>
          </tr>
        </thead>
        <tbody className="bg-gray-400 shadow-sm pb-28  ">
          {data?.teams.map((item: any) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <Link href={`/team/${item.id}`}>
                  <button className="button">Add Participant</button>
                </Link>
              </td>
              <td className="px-4 py-2 text-center">
                <Link href={`/team/${item.id}`}>
                  <button className="button">Remove Participant</button>
                </Link>
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  className=" deleteButton"
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
