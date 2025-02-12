import { useQuery } from "@tanstack/react-query";
import { FaBell, FaBookmark, FaHashtag, FaHome, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function SidebarPhone() {
  const location = useLocation();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  const navItems = [
    { path: "/", icon: <FaHome className="w-6 h-6" /> },
    { path: "/explore", icon: <FaHashtag className="w-6 h-6" /> },
    { path: "/notifications", icon: <FaBell className="w-6 h-6" /> },
    { path: "/bookmarks", icon: <FaBookmark className="w-6 h-6" /> },
    { path: `/profile/${authUser?.username || ""}`, icon: <FaUser className="w-6 h-6" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 md:hidden text-white">
      <div className="flex justify-around p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`p-2 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
