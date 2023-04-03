import Chat from "@/components/Chat";
import MyTeam from "@/components/MyTeam";
import TeamUsers from "@/components/TeamUsers";


import React from "react";

const dashboard = () => {
  return (
    <div className="flex justify-around">
      <MyTeam />
     
      <Chat />
    </div>
  );
};

export default dashboard;
