import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaBell, FaBookmark, FaHashtag, FaHome, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function SidebarPhone() {
  const location = useLocation();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  
  const navItems = [
    {
      path: "/",
      icon: <FaHome className="w-6 h-6" />,
      label: "Home",
      disabled: false,
    },
    {
      path: "/explore",
      icon: <FaHashtag className="w-6 h-6" />,
      label: "Explore",
      disabled: true,
    },
    {
      path: "/notifications",
      icon: <FaBell className="w-6 h-6" />,
      label: "Notifications",
      disabled: false,
    },
    {
      path: "/bookmarks",
      icon: <FaBookmark className="w-6 h-6" />,
      label: "Bookmarks",
      disabled: false,
    },
    {
      path: `/profile/${authUser?.username || ""}`,
      icon: <FaUser className="w-6 h-6" />,
      label: "Profile",
      disabled: false,
    },
  ];
  // Show toast for unavailable pages
  const handleUnavailablePage = (page) => {
    toast("🚀 " + page + " page is coming soon!", {
      style: { background: "#333", color: "#fff" },
      icon: "⏳",
      duration: 1000,
    });
  };
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 md:hidden text-white">
      <div className="flex justify-around p-2">
        {navItems.map((item) => (
          item.disabled ? (
            <button
              key={item.path}
              onClick={() => handleUnavailablePage(item.label)}
              className={`p-2 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-gray-700 text-blue-400"
                  : "hover:bg-gray-700 "
              }`}
            >
              {item.icon}
            </button>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-gray-700 text-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              {item.icon}
            </Link>
          )
          
        ))}
      </div>
    </div>
  );
}

{/* <Link
            key={item.path}
            to={item.path}
            className={`p-2 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            {item.icon}
          </Link> */}