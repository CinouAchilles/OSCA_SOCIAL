import { useState } from "react";
import { FaBell, FaHeart, FaComment, FaUser, FaCheck } from "react-icons/fa";
import NotificationSkeleton from "./NotificationSkeleton";
import Sidebar from "../../component/common/Sidebar";
import SidebarPhone from "../../component/common/SidebarPhone";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { Link } from "react-router-dom";

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  // Fetch notifications
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong!");

        return data;
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
  });

  // Mark notification as read
  const { mutate: markRead, isPending } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(
          `/api/notifications/${id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong!");

        return data;
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["notifications"], (prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      toast.success("Marked as read", {
        style: { background: "#333", color: "#fff" },
      });
    },
    onError: () =>
      toast.error("Failed to mark as read", {
        style: { background: "#333", color: "#fff" },
      }),
  });

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = notifications
    ? Math.ceil(notifications.length / itemsPerPage)
    : 1;
    const currentItems = notifications
    ? notifications
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];
  

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="min-h-screen text-white p-4 md:p-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <FaBell className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
        </div>

        {/* Error Handling */}
        {error && <p className="text-red-500">{error.message}</p>}

        {/* Notifications List */}
        <div className="space-y-4 min-h-[448px]">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => <NotificationSkeleton key={index} />)
          ) : currentItems.length > 0 ? (
            currentItems.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow ${
                  notification.read ? "bg-gray-700" : "bg-gray-800"
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Profile Picture */}
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <img
                      src={
                        notification.from.profileImg ||
                        "https://placehold.co/50x50"
                      }
                      alt={notification.from.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                      
                      <Link
                        to={`/profile/${
                          notification.from?.username || "/notifications"
                        }`}
                      >
                        <span className="font-bold text-base md:text-lg hover:underline cursor-pointer">
                          @{notification.from.username}
                        </span>
                      </Link>
                      <span className="text-gray-400 text-sm">
                        {notification.type === "like"
                          ? "liked your post"
                          : notification.type === "comment"
                          ? "commented on your post"
                          : notification.type === "follow"
                          ? "started following you"
                          : "interacted with your post"}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {formatDistanceToNowStrict(
                        new Date(notification.createdAt)
                      )}{" "}
                      ago
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
                        onClick={() => {
                          markRead(notification._id);
                        }}
                        className="text-gray-400 hover:text-green-400 transition"
                        disabled={isPending}
                      >
                        <FaCheck className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No notifications found.</p>
          )}
        </div>

        {/* Pagination */}
        {notifications && notifications.length > itemsPerPage && (
          <div className="flex justify-between md:justify-evenly items-center mt-6">
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
        )}
      </div>
      <SidebarPhone />
      <Toaster />
    </div>
  );
}
