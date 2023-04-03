import MyTeam from "@/components/MyTeam";

import TeamUsers from "@/components/TeamUsers";
import Chat from "@/components/chat";

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
