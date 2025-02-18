import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaHashtag,
  FaBell,
  FaBookmark,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import Xsvg from "../svgs/x";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import useLogout from "../../hooks/useLogout";

export default function Sidebar() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { logoutMutation } = useLogout();

  // Fetch authenticated user
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  // Logout function
  const handleLogout = async () => {
    try {
      await logoutMutation();
      toast.success("Logged out successfully!", {
        style: { background: "#333", color: "#fff" },
      });
    } catch (error) {
      toast.error(error.message || "Error logging out", {
        style: { background: "#333", color: "#fff" },
      });
    }
  };

  // Show toast for unavailable pages
  const handleUnavailablePage = (page) => {
    toast("🚀 " + page + " page is coming soon!", {
      style: { background: "#333", color: "#fff" },
      icon: "⏳",
      duration: 1000,
    });
  };

  // Navigation items
  const navItems = [
    { path: "/", icon: <FaHome className="w-6 h-6" />, label: "Home", disabled: false },
    { path: "/explore", icon: <FaHashtag className="w-6 h-6" />, label: "Explore", disabled: true },
    { path: "/notifications", icon: <FaBell className="w-6 h-6" />, label: "Notifications", disabled: false },
    { path: "/bookmarks", icon: <FaBookmark className="w-6 h-6" />, label: "Bookmarks", disabled: false },
    {
      path: `/profile/${authUser?.username || ""}`,
      icon: <FaUser className="w-6 h-6" />,
      label: "Profile",
      disabled: false,
    },
    { path: "/more", icon: <FiMoreHorizontal className="w-6 h-6" />, label: "More", disabled: true },
  ];

  return (
    <div className="w-1/5 md:w-1/4 lg:w-1/5 p-4 border-r border-gray-700 hidden md:flex flex-col h-screen text-white">
      <Toaster />
      
      {/* Logo */}
      <div className="flex justify-center">
        <Xsvg className="w-12 h-12 text-blue-400" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 mt-8">
        {navItems.map((item) =>
          item.disabled ? (
            <button
              key={item.path}
              onClick={() => handleUnavailablePage(item.label)}
              className="flex items-center space-x-3 p-2 rounded-lg transition hover:bg-gray-800 w-full text-left"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-2 rounded-lg transition ${
                location.pathname === item.path ? "bg-gray-800 text-blue-400" : "hover:bg-gray-800"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        )}
      </nav>

      {/* Push Profile Section to Bottom */}
      <div className="mt-auto">
        <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg flex-wrap">
          <div className="flex items-center space-x-3">
            <div
              style={{
                backgroundImage: `url(${authUser?.profileImg || "https://placehold.co/150"})`,
              }}
              className="w-10 h-10 bg-cover bg-center rounded-full"
            ></div>
            <div className="flex flex-col">
              <span className="font-bold">{authUser?.fullname || "Loading..."}</span>
              <span className="text-gray-400">@{authUser?.username || "..."}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-red-500 hover:bg-gray-700 rounded-lg transition"
            title="Logout"
          >
            <FaSignOutAlt className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
