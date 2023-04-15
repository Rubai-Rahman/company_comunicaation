import React from "react";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import Loading from "@/reusecomponents/Loading";

const TeamUsers = ({ teamId }: any) => {
  const { isLoading, error, data } = useTeamMembers(teamId);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="border rounded-lg  bg bg-slate-200  shadow-lg   ">
      <ul className="grid grid-cols-1 gap-4 mx-4">
        {data?.team_members.map((member: any) => (
          <li
            key={member?.id}
            className="p-4 rounded-lg shadow-md border m-4   border-gray-300"
          >
            <p className="font-bold text-sm">{member?.user?.name}</p>
            <p className=" text-sm">Role: {member?.user?.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamUsers;
