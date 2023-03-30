import { useQuery } from "react-query";
import React from "react";
import axiosInstance from "@/utils/hasuraSetup";

const AllUserPage = () => {
  const { isLoading, error, data } = useQuery("MyQuery", async () => {
    const query = `
              query  {
                users {
                  name,
                  email,
                  password,
                  role,id
                  
                }
              }
          `;
    const response = await axiosInstance.post("", { query });
    return response.data.data.users;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Role</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any) => (
          <tr key={item.id}>
            <td className="border px-4 py-2">{item.id}</td>
            <td className="border px-4 py-2">{item.name}</td>
            <td className="border px-4 py-2">{item.email}</td>
            <td className="border px-4 py-2">{item.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AllUserPage;
