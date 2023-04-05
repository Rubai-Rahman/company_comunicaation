import React from "react";
import { useUser } from "@/hooks/useUser";
import useDeleteUser from "@/hooks/useDeleteUser";

const AllUserPage = () => {
  const { isLoading, data } = useUser();
  const deleteUser = useDeleteUser();
  const handleDeleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      
      deleteUser.mutate(id);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <table className="table-auto w-full bg-slate-300 ">
      <thead className="border-collapse ">
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Role</th>
          <th className="px-4 py-2">EditUser</th>
          <th className="px-4 py-2">DeleteUser</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any) => (
          <tr key={item.id}>
            <td className="border px-4  py-2">{item.id}</td>
            <td className="border px-4 py-2">{item.name}</td>
            <td className="border px-4 py-2">{item.email}</td>
            <td className="border px-4 py-2">{item.role}</td>

            <td className="border px-4 py-2">
              <button className="w-20  rounded-md text-blue-500  hover:bg-blue-600 hover:text-white px-4 py-2 ring-2 ring-blue-600 hover:ring-offset-2">
                Edit
              </button>
            </td>
            <td className="border px-4 py-2 ">
              <button
                className="w-20  rounded-md text-red-500  hover:bg-red-600 hover:text-white px-4 py-2 ring-2 ring-red-600 hover:ring-offset-2"
                onClick={() => handleDeleteUser(item.id)}
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

export default AllUserPage;
