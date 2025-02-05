import { data, Link, useLocation } from "react-router-dom";
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

export default function Sidebar() {
  const location = useLocation();
  const queryClient = useQueryClient();
  // const user = {
  //   username: "JohnDoe",
  //   fullName: "John Doe",
  //   profilePic: "https://placehold.co/150",
  // };

  const { mutateAsync: logoutMutation } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
      return data;
    },
    onSuccess: () => {
      console.log("✅ User logged out");
      queryClient.setQueriesData(["authUser"], null);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      console.log("❌ Error logging out user");
    },
  });

  const handleLogout = () => {
    toast.promise(
      logoutMutation(),
      {
        loading: "Logging out...",
        success: <b>Logged out successfully!</b>,
        error: (error) => <b>{error.message || "Error logging out user"}.</b>,
      },
      {
        style: { background: "#333", color: "#fff" },
      }
    );
  };

  const navItems = [
    { path: "/", icon: <FaHome className="w-6 h-6" />, label: "Home" },
    {
      path: "/explore",
      icon: <FaHashtag className="w-6 h-6" />,
      label: "Explore",
    },
    {
      path: "/notifications",
      icon: <FaBell className="w-6 h-6" />,
      label: "Notifications",
    },
    {
      path: "/bookmarks",
      icon: <FaBookmark className="w-6 h-6" />,
      label: "Bookmarks",
    },
    {
      path: "/profile",
      icon: <FaUser className="w-6 h-6" />,
      label: "Profile",
    },
    {
      path: "/more",
      icon: <FiMoreHorizontal className="w-6 h-6" />,
      label: "More",
    },
  ];
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  return (
    <div className="w-1/5 md:w-1/4 lg:w-1/5 p-4 border-r border-gray-700 hidden md:flex flex-col h-screen text-white">
      <Toaster />
      {/* Logo */}
      <div className="flex justify-center">
        <Xsvg className="w-12 h-12 text-blue-400" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 mt-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 p-2 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-gray-800 text-blue-400"
                : "hover:bg-gray-800"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Tweet Button */}
      {/* <button className="w-full p-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
        Tweet
      </button> */}

      {/* Push Profile Section to Bottom */}
      <div className="mt-auto">
        <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg flex-wrap">
          <div className="flex items-center space-x-3">
            <img
              src={authUser.profileImg}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-bold">{authUser.fullname}</span>
              <span className="text-gray-400">@{authUser.username}</span>
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
