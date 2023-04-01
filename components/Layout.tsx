
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
// import Footer from "./Footer";
// import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import setAxios from "@/utils/setAxios";

function Layout({ children }: any) {
 const session: any = useSession();
 
  if (session.data && session.status === "authenticated") {
    const Token = session.data.jwtToken;
   
    setAxios(session.data.jwtToken as string);
    
  } else {
    setAxios(null);
  }
  const router = useRouter();
  if (
    router.pathname === "/" ||
    router.pathname === "/auth/user-signup"
  ) {
    return <>{children}</>;
  }
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 flex-none">
        <Sidebar />
      </div>
      {/* Main content */}
      <div className="flex-grow">
        {/* Navbar */}
        <nav className="bg-gray-200 p-4">
          <Navbar/>
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
