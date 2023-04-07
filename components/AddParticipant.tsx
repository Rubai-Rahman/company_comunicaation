import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import axiosInstance from "@/utils/hasuraSetup";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import { useTeamMembers } from "@/hooks/useTeamMembers";

type User = {
  team_id: string | number;
  user_id: string | number;
};
const baseURL: any = process.env.hasuraEndPoint;
const hasurasecret: any = process.env.hasuraSecret;

const AddParticipant = () => {
  //get data from db
  const { isLoading, data: users } = useUser();

  const router = useRouter();

  const { id }: any = router.query;
  let teamId = id;
  const { data: session }: any = useSession();

  let token = session?.jwtToken;
  const [member, setMember] = useState<User>({
    team_id: id,
    user_id: "",
  });
  const { error, data: teamData } = useTeamMembers(teamId);

  const {
    mutate,
    isSuccess,
    data: members,
  } = useMutation(
    (member: User) => {
      console.log("memberbeforesubmit", member);
      return axios.post(
        baseURL,
        {
          query: `
  mutation MyMutation($team_id: Int = "", $user_id: Int = "") {
  insert_team_members_one(object: {team_id: $team_id, user_id: $user_id}) {
    id
    team_id
    user {
      name
      role
      id
      email
    }
  }
}


`,
          variables: {
            team_id: member.team_id,
            user_id: member.user_id,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          //  "x-hasura-admin-secret": hasurasecret,
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: (data) => {
        setMember({
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

      user_id: selectedUser?.id || "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
console.log(teamData);
    const existMember = teamData?.team_members?.find((user: any) => {
      console.log(user?.user?.id);
      return user?.user?.id == member.user_id;
    });
 
    if (existMember) {
      alert("user exist select another User ");
      return;
    } else {
      await mutate(member);
    }
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
         className=" ring-2 ring-gray-800 text-gray-700 hover:text-white    hover:bg-gray-700  font-bold py-2 px-4 rounded"
          disabled={isLoading}
        >
          {isLoading ? "ADD Participant..." : "ADD Participant"}
        </button>
      </form>
    </div>
  );
};

export default AddParticipant;
