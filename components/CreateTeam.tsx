import React, { useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

import { useState } from "react";
import { useMutation } from "react-query";
//import { useCreateUser } from "@/hooks/useCreateUser";
type TEAM = {
  name: string;
  admin: string |undefined;
};
const baseURL: any = process.env.hasuraEndPoint;

const CreateTeam = () => {
  const { data: session, status }: any = useSession();
    const [admin, setAdmin] = useState<string | undefined>(undefined);
const [team, setTeam] = useState<TEAM>({
  name: "",
  admin: "",
});
  
  useEffect(() => {
    if (session) {
      setAdmin(session.user.name);
      setTeam({
        ...team,
        admin: session.user.name,
      });
    }
  }, [session]);



  let token = session?.jwtToken;
  

  const { mutate, isLoading, isSuccess, data } = useMutation(
    (data: TEAM) => {
      return axios.post(
        baseURL,
        {
          query: `
  mutation CreateTeam($team: teams_insert_input!) {
    insert_teams_one(object: $team) {
      id,name,admin
    }
  }
`,
          variables: {
            team,
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
        setTeam({
          name: "",
          admin:admin,
        });
        alert("Team Created Successfully");
        
      },
    }
  );

  // if (isSuccess) {
  //   alert("Team Created ");
  // }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    await mutate(team);
  };

  return (
    <div>
      <div className="max-w-xl mx-auto mb-9">
        <h1 className="text-3xl font-bold mb-8">Create A Team</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-bold mb-2">
              Team Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={team.name}
              onChange={(e) => setTeam({ ...team, name: e.target.value })}
              className="border p-2 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Creating Team..." : "Create Team"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
