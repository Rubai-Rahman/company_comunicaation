import { ReactNode, lazy, LazyExoticComponent, Suspense, FC } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiMenu } from "react-icons/fi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiTeamLine } from "react-icons/ri";
import { GoOrganization } from "react-icons/go";
import Link from "next/link";

type SidebarItem = {
  label: string;
  icon: string | ReactNode;
  route: any;
  authorizedRoles?: string[];
  component?: LazyExoticComponent<FC>;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: <MdOutlineSpaceDashboard />,
    route: "/dashboard",
    authorizedRoles: ["administrator", "member", "manager"],
    component: lazy(() => import("./MyTeam")),
  },
  {
    label: "AllUser",
    icon: <HiOutlineUsers />,
    route: "/alluser",
    authorizedRoles: ["administrator"],
  },
  {
    label: "AddNewUser",
    icon: <AiOutlineUserAdd />,
    route: "/addnewuser",
    authorizedRoles: ["administrator"],
  },
  {
    label: "Create Team",
    icon: <RiTeamLine />,
    route: "/createteam",
    authorizedRoles: ["administrator"],
  },
  {
    label: "Manage Team",
    icon: <GoOrganization />,
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

  const { data: session }: any = useSession();
  const userRole = session?.user?.role;

  const toggleMenu = () => setIsSidebarOpen(!isSidebarOpen);

  const filteredSidebarItems = sidebarItems.filter(
    (item) => !item.authorizedRoles || item.authorizedRoles.includes(userRole)
  );

  return (
    <div className="bg-grey-800 text-white w-64 flex-none h-60 ">
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
          <Link
            key={item.route}
            href={item.route}
            className={`${
              router.pathname === item.route ? "bg-gray-900" : ""
            } flex items-center py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-700`}
          >
            <p>{item.icon}</p>
            {isSidebarOpen && <span className="ml-4">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
