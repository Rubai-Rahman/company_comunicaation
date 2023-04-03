import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";

interface NavbarProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
}

const handleLogOut = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  event.preventDefault();
  signOut({
    callbackUrl: "http://localhost:3000",
  });
};

const Navbar: React.FC<NavbarProps> = ({ setIsSidebarOpen, isSidebarOpen }) => {
  const session: any = useSession();
  let name = session?.data?.user?.name;

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="bg-gray-700 shadow-md w-full">
      <div className="max-w-full mx-auto sm:px-4">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            {isSidebarOpen ? null : (
              <button onClick={handleSidebarToggle}>
                <FiMenu className="w-6 h-6" />
              </button>
            )}

            <span className="ml-2 text-lg font-bold text-white">
              Log In As: {name}
            </span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button onClick={handleLogOut} className="text-white">
              LogOut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
