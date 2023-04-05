import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import axiosInstance from "@/utils/hasuraSetup";
import { useRouter } from "next/router";

type User = {
  name: string;
  team_id: string | number;
  user_id: string | number;
};
const baseURL: any = process.env.hasuraEndPoint;
const hasurasecret: any = process.env.hasuraSecret;

const AddParticipant = () => {
  //get data from db
  const { isLoading, data: users } = useQuery("MyQuery", async () => {
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

  const router = useRouter();
  const { id }: any = router.query;
  const { data: session }: any = useSession();

  let token = session?.jwtToken;
  const [member, setMember] = useState<User>({
    name: "",
    team_id: id,
    user_id: "",
  });
  const { error, data: teamData } = useQuery(
    ["MyQuery", id],
    async () => {
      const query = `
        query {
          team_members(where: {team_id: {_eq: "${id}"}}) {
            id
            name
            user_id
          }
        }`;
      const response = await axiosInstance.post("", { query });

      return response.data.data;
    },
    {
      enabled: id ? true : false, // enable the query if teamId exists
    }
  );


  const {
    mutate,
    isSuccess,
    data: members,
  } = useMutation(
    (data: User) => {
      return axios.post(
        baseURL,
        {
          query: `
  mutation AddTeamMember($member: team_members_insert_input!) {
    insert_team_members_one(object: $member) {
      team_id,name
    }
  }
`,
          variables: {
            member,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            //"x-hasura-admin-secret": hasurasecret,
             Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: (data) => {
        setMember({
          name: "",
          team_id: id,
          user_id: "",
        });
        alert("Participant Added Successfully");
       
      },
    }
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserName = e.target.value;
    const selectedUser = users?.find(
      (user: any) => user.name === selectedUserName
    );

    setMember({
      ...member,
      name: selectedUserName,
      user_id: selectedUser?.id || "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const existMember = teamData?.team_members?.find((user: any) => {
   
      return user?.user_id == member.user_id;
      // if (user?.user_id == member.user_id) {
      //   alert("user Exist");
      //   return;
      // }
      // else {
      //  alert("userDont exist");
      // }
    });
    if (existMember) {
      alert("user exist select another User ");
      return;
    } else {
      await mutate(member);
    } ;

  
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add Team Participant</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-bold mb-2">
            Name
          </label>
          <select
            id="name"
            name="name"
            value={member.name}
            onChange={handleNameChange}
            className="border p-2 w-full"
          >
            <option value="" disabled defaultValue="">
              Select
            </option>
            {users?.map((item: any) => (
              <option value={item.name} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={isLoading}
        >
          {isLoading ? "ADD Participant..." : "ADD Participant"}
        </button>
      </form>
    </div>
  );
};

export default AddParticipant;
