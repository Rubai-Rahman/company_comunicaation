import React from "react";

import { useTeamMembers } from "@/hooks/useTeamMembers";

const TeamUsers = ({ teamId }: any) => {
 
  const { isLoading, error, data } = useTeamMembers(teamId);
 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg  bg bg-slate-200  shadow-lg   ">
      <ul className="grid grid-cols-2 gap-4 mx-4">
        {data?.team_members.map((member: any) => (
          <li
            key={member?.id}
            className="p-4 rounded-lg shadow-md border m-4  border-gray-300"
          >
            <p className="font-bold text-lg">{member?.user?.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamUsers;
