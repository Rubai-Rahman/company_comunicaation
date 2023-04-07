import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

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
  const [enableModal, setEnableModal] = useState(false);
  const handleSidebarToggle = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };
  const handleUserModal = () => {};

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
            <button onClick={() => setEnableModal(true)} className="text-white">
              {<CgProfile />}
            </button>
          </div>
        </div>
      </div>
      {enableModal && (
        <div className="fixed inset-0 z-50 flex items-start  justify-end">
          <div className="bg-gray-300 shadow-lg shadow-gray-800  rounded-lg p-4">
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button onClick={handleLogOut} className="text-black">
                LogOut
              </button>
            </div>
           
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setEnableModal(false)}
              >
                Cancel
              </button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
