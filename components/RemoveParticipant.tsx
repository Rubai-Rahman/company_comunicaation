import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axiosInstance from "@/utils/hasuraSetup";
import { useRouter } from "next/router";
import { Http2ServerRequest } from "http2";

type TeamMember = {
  id: number;
  name: string;
};

const hasurasecret: any = process.env.hasuraSecret;

const TeamMembers: React.FC = () => {
  const router = useRouter();
  const { id }: any = router.query;
  let teamId = id;
  console.log(teamId);
  const { isLoading, error, data } = useQuery(
    ["MyQuery", teamId],
    async () => {
      const query = `
        query {
          team_members(where: {team_id: {_eq: "${teamId}"}}) {
            id
            name
          }
        }`;
      const response = await axiosInstance.post("", { query });

      return response.data.data;
    },
    {
      enabled: teamId ? true : false, // enable the query if teamId exists
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (data.team_members.length <= 0) {
    return <h2>This Group Does Not Have any Participant </h2>;
  }
  console.log(data?.team_members);
  return (
    <div>
      <h2>Team Members:</h2>
      <ul>
        {data.team_members.map((member: TeamMember) => (
          <li key={member.id}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TeamMembers;
