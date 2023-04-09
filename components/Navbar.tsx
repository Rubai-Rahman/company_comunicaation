import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

import useSingleUser from "@/hooks/useSingleUser";
import useEditSingleUser from "@/hooks/useEditSingleUser";

interface NavbarProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
}
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

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
  let id = session?.data?.user?.id;
  console.log(id);
  const [enableModal, setEnableModal] = useState(false);
  const [enableModal2, setEnableModal2] = useState(false);
  const handleSidebarToggle = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const { data: userData, isLoading, isError } = useSingleUser(id);

  const editUser = useEditSingleUser();

  const [formData, setFormData] = useState<User>({
    id: userData?.id || id,
    name: "",
    email: "",
    password: "",
  });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!userData) {
  //   return <div>No user data available</div>;
  // }

  // Access userData properties safely

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    editUser.mutate(formData);

    setEnableModal2(false);
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

          <div className="hidden sm:ml-6 sm:flex sm:items-center text-3xl bg-gray-800 p-4 rounded-full  ">
            <button onClick={() => setEnableModal(true)} className="text-white">
              {<CgProfile />}
            </button>
          </div>
        </div>
      </div>
      {enableModal && (
        <div className="fixed inset-0 z-50 flex items-start  justify-end">
          <div className="bg-gray-300 shadow-lg shadow-gray-800  rounded-lg p-4">
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => {
                  setEnableModal2(true);
                  setEnableModal(false);
                }}
              >
                Edit Profile
              </button>
            </div>
            <div className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
              <button onClick={handleLogOut} className="text-black">
                LogOut
              </button>
            </div>
            <div className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
              <button onClick={() => setEnableModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {enableModal2 && (
        <div className="fixed inset-0 z-50 flex items-start  justify-end">
          <div className="bg-gray-300 shadow-lg shadow-gray-800  rounded-lg p-4">
            <div className="flex justify-end">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData?.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData?.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData?.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                {/* add more form fields as needed */}

                <div className="flex justify-center mr-8 ">
                  <button
                    type="submit"
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Update
                  </button>
                </div>
              </form>

              <div className="flex align-bottom mt-64 ml-5  ">
                <button
                  className="h-10 ml-6  bg-gray-300 hover:bg-gray-400  text-gray-800 font-bold py-2 px-4 rounded mr-2 ring-red-600 ring-1"
                  onClick={() => setEnableModal2(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
