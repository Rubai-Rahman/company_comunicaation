import Chat from "@/components/Chat";
import MyTeam from "@/components/MyTeam";

import React from "react";

const dashboard = () => {
  return (
    <div className="flex justify-around">
      <div>
        <MyTeam />
      </div>
      <div>
        <Chat/>
      </div>
    </div>
  );
};

export default dashboard;
