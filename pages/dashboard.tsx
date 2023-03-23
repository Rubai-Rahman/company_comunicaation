import { useState } from "react";
import { useRouter } from "next/router";
import { XIcon as Icon } from "@heroicons/react/solid";

type SidebarItem ={
  label: string;
  icon: string;
  route: string;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: "home",
    route: "/dashboard",
  },
  {
    label: "Customers",
    icon: "user-group",
    route: "/customers",
  },
  {
    label: "Orders",
    icon: "clipboard-list",
    route: "/orders",
  },
  {
    label: "Settings",
    icon: "cog",
    route: "/settings",
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
            <Icon className="h-8 w-8" name="logo" />
            {isOpen && <span className="text-lg font-bold">Admin Panel</span>}
          </div>
          <button onClick={toggleMenu}>
            <Icon className="h-6 w-6" name={isOpen ? "x" : "menu"} />
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
              <Icon className="h-5 w-5" name={item.icon} />
              {isOpen && <span className="ml-4">{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex-grow bg-gray-100 p-4">
        <h1 className="text-2xl font-bold">Welcome to the Admin Panel</h1>
        <p className="mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed
          mi augue. Nullam faucibus, nunc sed tincidunt efficitur, mauris velit
          blandit augue, non tempus turpis risus id metus.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
