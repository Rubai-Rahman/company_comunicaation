import { signOut, useSession } from "next-auth/react";
import React from "react";

const handleLogOut = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  event.preventDefault();
  signOut({
    callbackUrl: "http://localhost:3000",
  });
};
const Navbar: React.FC = () => {
  const session: any = useSession();
  let name = session?.data?.user?.name;

  return (
    <div className="bg-gray-700 shadow-md     ">
      <div className="max-w-full mx-auto  sm:px-4 ">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
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
