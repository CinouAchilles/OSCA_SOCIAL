import { Link } from "react-router-dom";
import { FaHome, FaHashtag, FaBell, FaBookmark, FaUser, FaSignOutAlt  } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import Xsvg from "../svgs/x";

export default function Sidebar() {
    const user = {
      username: "JohnDoe",
      fullName: "John Doe",
      profilePic: "https://placehold.co/150",
    };
  
    const handleLogout = () => {
      console.log("User logged out");
    };
  
    return (
      <div className="w-1/5 md:w-1/4 lg:w-1/5 p-4 border-r border-gray-700 hidden md:flex flex-col h-screen">
        {/* Logo */}
        <div className="flex justify-center">
          <Xsvg className="w-12 h-12 text-blue-400" />
        </div>
  
        {/* Navigation */}
        <nav className="flex flex-col space-y-2 mt-8">
          <Link to="/home" className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg">
            <FaHome className="w-6 h-6" />
            <span>Home</span>
          </Link>
          <Link to="/explore" className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg">
            <FaHashtag className="w-6 h-6" />
            <span>Explore</span>
          </Link>
          <Link to="/notifications" className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg">
            <FaBell className="w-6 h-6" />
            <span>Notifications</span>
          </Link>
          <Link to="/bookmarks" className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg">
            <FaBookmark className="w-6 h-6" />
            <span>Bookmarks</span>
          </Link>
          <Link to="/profile" className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg">
            <FaUser className="w-6 h-6" />
            <span>Profile</span>
          </Link>
          <Link to="/more" className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg">
            <FiMoreHorizontal className="w-6 h-6" />
            <span>More</span>
          </Link>
        </nav>
  
        {/* Tweet Button */}
        <button className="w-full p-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
          Tweet
        </button>
  
        {/* Push Profile Section to Bottom */}
        <div className="mt-auto">
          <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <img src={user.profilePic} alt="Profile" className="w-10 h-10 rounded-full" />
              <div className="flex flex-col">
                <span className="font-bold">{user.fullName}</span>
                <span className="text-gray-400">@{user.username}</span>
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
  