import { useSession } from "next-auth/react";
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
    label: "Create Team",
    icon: "cog",
    route: "/createteam",
  },
  {
    label: "Manage Team",
    icon: "cog",
    route: "/manageteam",
  },
];

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const router = useRouter();


  const toggleMenu = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="bg-gray-800 text-white w-64 flex-none h-screen">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <BiConfused className="h-8 w-8" name="logo" />
          {isSidebarOpen && (
            <span className="text-lg font-bold">Admin Panel</span>
          )}
        </div>
        <button onClick={toggleMenu}>
          <BiConfused className="h-6 w-6" name={isSidebarOpen ? "x" : "menu"} />
        </button>
      </div>
      <nav className="pb-4 pr-4">
        {sidebarItems.map((item) => (
          <a
            key={item.route}
            href={item.route}
            className={`${
              router.pathname === item.route ? "bg-gray-900" : ""
            } flex items-center py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-700`}
          >
            <BiConfused className="h-5 w-5" name={item.icon} />
            {isSidebarOpen && <span className="ml-4">{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
