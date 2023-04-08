import axiosInstance from '@/utils/hasuraSetup';
import React from 'react';
import { useQuery } from 'react-query';

const useSingleUser = (id:any) => {
  return useQuery(["user", id], async () => {
    const query = `
        query GetUserById($id: Int!) {
          users_by_pk(id: $id) {
            name
            password
            email
            id
          }
        }
      `;
    const response = await axiosInstance.post("", {
      query,
      variables: { id },
    });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data.users_by_pk;
  });
};

export default useSingleUser;