import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import setAxios from "@/utils/setAxios";

function Layout({ children }: any) {
  const session: any = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (session.data && session.status === "authenticated") {
    const Token = session.data.jwtToken;

    setAxios(session.data.jwtToken as string);
  } else {
    setAxios(null);
  }

  const router = useRouter();
  if (router.pathname === "/" || router.pathname === "/auth/user-signup") {
    return <>{children}</>;
  }
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 h-auto text-white w-64 ${
          isSidebarOpen ? "" : "hidden"
        } flex-none`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      {/* Main content */}
      <div className="flex-grow">
        {/* Navbar */}
        <nav className="bg-gray-200">
          <Navbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </nav>
        {/* Page content */}
        <div className="">{children}</div>
        {/* Footer */}
        <footer className="bg-gray-200 p-4">
          <h2>footer</h2>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
