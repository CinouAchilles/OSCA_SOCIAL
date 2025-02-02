import { useState } from "react";
import { FaBell, FaHeart, FaComment, FaUser, FaCheck } from "react-icons/fa";
import NotificationSkeleton from "./NotificationSkeleton";
import Sidebar from "../../component/common/Sidebar";
import SidebarPhone from "../../component/common/SidebarPhone";
import SettingsIcon from "@mui/icons-material/Settings";
import toast, { Toaster } from "react-hot-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      user: "JohnDoe",
      message: "liked your tweet",
      type: "like",
      timestamp: "2h ago",
      profilePic: "https://placehold.co/150",
      read: false,
    },
    {
      id: 2,
      user: "JaneDoe",
      message: "commented on your tweet",
      type: "comment",
      timestamp: "5h ago",
      profilePic: "https://placehold.co/150",
      read: false,
    },
    {
      id: 3,
      user: "Alice",
      message: "started following you",
      type: "follow",
      timestamp: "1d ago",
      profilePic: "https://placehold.co/150",
      read: false,
    },
    {
      id: 4,
      user: "Bob",
      message: "liked your post",
      type: "like",
      timestamp: "3d ago",
      profilePic: "https://placehold.co/150",
      read: true,
    },
    {
      id: 5,
      user: "Charlie",
      message: "commented on your post",
      type: "comment",
      timestamp: "5d ago",
      profilePic: "https://placehold.co/150",
      read: true,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = notifications.slice(indexOfFirstItem, indexOfLastItem);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const btnsettigns = () => {
    toast("Settings feature coming soon!", {
      icon: "⚙️", // Gear icon for settings
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  };
  

  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <div className="min-h-screen flex">
      <Toaster />
      <Sidebar />
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 flex-1 ">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <FaBell className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          <button
            className="p-2 rounded-full hover:bg-gray-700 transition active:scale-95 focus:outline-none focus:rotate-90"
            onClick={(e) => btnsettigns(e)}
          >
            <SettingsIcon className="w-8 h-8 text-gray-400 cursor-pointer transition-transform duration-200 " />
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {currentItems.length > 0
            ? currentItems.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow ${
                    notification.read ? "bg-gray-700" : "bg-gray-800"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Profile Picture */}
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <img
                        src={notification.profilePic}
                        alt={notification.user}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                        <span className="font-bold text-base md:text-lg hover:underline cursor-pointer">
                          {notification.user}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {notification.message}
                        </span>
                      </div>

                      {/* Timestamp */}
                      <div className="text-gray-400 text-sm mt-1">
                        {notification.timestamp}
                      </div>
                    </div>

                    {/* Notification Actions */}
                    <div className="flex items-center space-x-3">
                      {notification.type === "like" && (
                        <FaHeart className="w-5 h-5 text-red-500" />
                      )}
                      {notification.type === "comment" && (
                        <FaComment className="w-5 h-5 text-blue-500" />
                      )}
                      {notification.type === "follow" && (
                        <FaUser className="w-5 h-5 text-green-500" />
                      )}

                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-gray-400 hover:text-green-400 transition"
                        >
                          <FaCheck className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            : Array(3)
                .fill(0)
                .map((_, index) => <NotificationSkeleton key={index} />)}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <SidebarPhone />
    </div>
  );
}
