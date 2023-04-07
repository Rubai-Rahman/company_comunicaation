import React, { useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation } from "react-query";
import { useAdmin } from "@/hooks/useAdmin";

type TEAM = {
  name: string;
  admin: string | undefined;
  team_members: string | [];
};

const baseURL: any = process.env.hasuraEndPoint;
const hasurasecret: any = process.env.hasuraSecret;

const CreateTeam = () => {
  const { data: admins } = useAdmin();

  const adminIds: any = admins?.users?.map((admin: any) => {
    return { user_id: admin.id };
  });

  const { data: session, status }: any = useSession();
  const [admin, setAdmin] = useState<string | undefined>(undefined);

  const [team, setTeam] = useState<TEAM>({
    name: "",
    admin: "",
    team_members: [],
  });

  useEffect(() => {
    if (session) {
      setAdmin(session.user.name);
      setTeam((prevTeam) => ({
        ...prevTeam,
        admin: session.user.name,
        team_members: adminIds,
      }));
    }
  }, [session]);
  useEffect(() => {
    if (admins?.users) {
      const adminIds = admins?.users?.map((admin: any) => {
        return { user_id: admin.id };
      });
      setTeam((prevTeam) => ({
        ...prevTeam,
        team_members: adminIds,
      }));
    }
  }, [admins]);

  let token = session?.jwtToken;

  const {
    mutate,
    isLoading,
    error,
    data: returnValue,
  } = useMutation(
    (requestData: any) => {
      console.log("axiosData", requestData);
      return axios.post(
        baseURL,
        {
          query: `mutation MyMutation($data: [team_members_insert_input!] = {}, $admin: String = "", $name: String = "") {
  insert_teams_one(object: {admin: $admin, name: $name, team_members: {data: $data}}) {
    id
    admin
  }
}

 `,
          variables: {
            admin: requestData.admin,
            name: requestData.name,
            data: requestData.team_members,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": hasurasecret,
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: () => {
        setTeam({
          name: "",
          admin: admin,
          team_members: adminIds,
        });

        console.log("error", error, "data", returnValue, "team", team);
        alert("Team Created Successfully");
      },
    }
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submit", team);
    await mutate({
      name: team.name,
      admin: team.admin,
      team_members: team.team_members,
    });
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
