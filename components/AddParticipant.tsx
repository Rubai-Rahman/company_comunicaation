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
  const { isLoading, data } = useQuery("MyQuery", async () => {
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

  //set data

  const router = useRouter();
  const { id }: any = router.query;
  const { data: session }: any = useSession();
  let user_id = session?.user?.id;
  let token = session?.jwtToken;
  const [member, setMember] = useState<User>({
    name: "",
    team_id: id,
    user_id: user_id,
  });
  const { mutate, isSuccess } = useMutation(
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
            "x-hasura-admin-secret": hasurasecret,
           " authorization": `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: (data) => {
        setMember({
          name: "",
          team_id: id,
          user_id: user_id,
        });
        alert("User Added Successfully");
        console.log("Response data:", data.data);
      },
    }
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await mutate(member);
    console.log("newMember", member);
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
            onChange={(e) => setMember({ ...member, name: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="" disabled defaultValue="">
              Select
            </option>
            {data?.map((item: any) => (
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
