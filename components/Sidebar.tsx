import { useState } from "react";
import { useRouter } from "next/router";
import { BiConfused } from "react-icons/bi";

type SidebarItem = {
  label: string;
  icon: string;
  route: string;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: "home",
    route: "/dashboard",
  },
  {
    label: "AllUser",
    icon: "user-group",
    route: "/alluser",
  },
  {
    label: "AddNewUser",
    icon: "clipboard-list",
    route: "/addnewuser",
  },
  {
    label: "RemoveUser",
    icon: "cog",
    route: "/settings",
  },
  {
    label: "EditUser",
    icon: "cog",
    route: "/settings",
  },
  {
    label: "Create Team",
    icon: "cog",
    route: "/createteam",
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-gray-800 text-white flex flex-col transition-all duration-500`}
      >
        
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <BiConfused className="h-8 w-8" name="logo" />
            {isOpen && <span className="text-lg font-bold">Admin Panel</span>}
          </div>
          <button onClick={toggleMenu}>
            <BiConfused className="h-6 w-6" name={isOpen ? "x" : "menu"} />
          </button>
        </div>
        <nav className="flex-grow pb-4 pr-4">
          {sidebarItems.map((item) => (
            <a
              key={item.route}
              href={item.route}
              className={`${
                router.pathname === item.route ? "bg-gray-900" : ""
              } flex items-center py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-700`}
            >
              <BiConfused className="h-5 w-5" name={item.icon} />
              {isOpen && <span className="ml-4">{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
