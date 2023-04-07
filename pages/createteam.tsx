import AllTeam from "@/components/AllTeam";
import CreateTeam from "@/components/CreateTeam";
import React from "react";

const createteam = () => {
  return (
    <div className="bg-gray-500 h-screen pt-6   ">
      <CreateTeam />
      <AllTeam />
    </div>
  );
};

export default createteam;
