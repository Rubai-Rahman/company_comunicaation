import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiMenu } from "react-icons/fi";

type SidebarItem = {
  label: string;
  icon: string;
  route: string;
  authorizedRoles?: string[];
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: "home",
    route: "/dashboard",
    authorizedRoles: ["administrator", "member","manager"],
  },
  {
    label: "AllUser",
    icon: "user-group",
    route: "/alluser",
    authorizedRoles: ["administrator"],
  },
  {
    label: "AddNewUser",
    icon: "clipboard-list",
    route: "/addnewuser",
    authorizedRoles: ["administrator"],
  },
  {
    label: "Create Team",
    icon: "cog",
    route: "/createteam",
    authorizedRoles: ["administrator"],
  },
  {
    label: "Manage Team",
    icon: "cog",
    route: "/manageteam",
    authorizedRoles: ["administrator"],
  },
];

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const router = useRouter();

  const { data: session }:any = useSession();
  const userRole = session?.user?.role;

  const toggleMenu = () => setIsSidebarOpen(!isSidebarOpen);

  const filteredSidebarItems = sidebarItems.filter(
    (item) => !item.authorizedRoles || item.authorizedRoles.includes(userRole)
  );

  return (
    <div className="bg-gray-800 text-white w-64 flex-none h-screen">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          {isSidebarOpen && (
            <span className="text-lg font-bold">Admin Panel</span>
          )}
        </div>
        <button onClick={toggleMenu}>
          <FiMenu className="h-6 w-6" name={isSidebarOpen ? "x" : "menu"} />
        </button>
      </div>
      <nav className="pb-4 pr-4">
        {filteredSidebarItems.map((item) => (
          <a
            key={item.route}
            href={item.route}
            className={`${
              router.pathname === item.route ? "bg-gray-900" : ""
            } flex items-center py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-700`}
          >
            <FiMenu className="h-5 w-5" name={item.icon} />
            {isSidebarOpen && <span className="ml-4">{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
