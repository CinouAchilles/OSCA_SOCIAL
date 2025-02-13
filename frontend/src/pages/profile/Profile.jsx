import { useEffect, useState } from "react";
import { FaShare, FaUserEdit } from "react-icons/fa";
import Sidebar from "../../component/common/Sidebar";
import SidebarPhone from "../../component/common/SidebarPhone";
import toast, { Toaster } from "react-hot-toast";
import CommentDialog from "../../component/common/CommentDialog";
import TweetFeed from "../../component/common/TweetFeed";
import ImageModal from "../../component/common/ImageModal";
import EditProfileDialog from "./EditProfileDialogComp";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useFetchTweets from "../../hooks/useFetchTweets";
import useFollow from "../../hooks/useFollow";
import RightPanel from "../../component/common/RightPanel";
import TweetSkeleton from "../../component/skeletons/TweetSkeleton";
import ProfileBannerSkeleton from "../../component/skeletons/ProfileBannerSkeleton";
import ProfileInfoSkeleton from "../../component/skeletons/ProfileInfoSkeleton";

export default function ProfilePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [feedType, setFeedType] = useState("Tweets"); // 🔹 Added missing state for tab selection

  const { username } = useParams();
  const queryClient = useQueryClient();
  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  // Fetch user profile
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/api/users/profile/${username}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return res.json();
    },
  });
  // Fetch user tweets
  const {
    data: tweets,
    isLoading: tweetsLoading,
    isError,
    refetch: refetchTweets,
  } = useFetchTweets(
    user?._id != authUser?._id ? "Tweets" : feedType, // 🔹 Use "Tweets" for user's own profile
    username,
    user?._id // Ensure we only pass `user._id` when `user` exists
  );
  

  // Invalidate tweets query when username or feedType changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["tweets", feedType, username, user?._id] });
  }, [username, feedType, user?._id, queryClient]); // Added `username` to dependencies

  const { mutate: updateUserPro, isPending: isProUpdated } = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          throw new Error("Failed to update profile");
        }
        return res.json();
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
        queryClient.invalidateQueries({ queryKey: ["tweets"] }),
      ]);
      toast.success("Profile updated successfully", {
        style: { background: "#333", color: "#fff" },
      });
    },
    onError: () => {
      toast.error("Failed to update profile", {
        style: { background: "#333", color: "#fff" },
      });
    },
  });

  const handleEditProfile = () => {
    setOpenEditDialog(true);
  };

  return (
    <div className="min-h-screen flex text-white">
      <Toaster />
      <Sidebar />

      <div className="min-h-screen overflow-y-scroll border-r border-gray-700 h-screen scrollbar-custom md:w-auto md:mb-0 flex-1 pb-14 md:pb-0">
        {/* Profile Banner */}
        
        {isLoading ? (
          <ProfileBannerSkeleton />
        ) : (
          <div className="relative h-48 bg-gray-800">
            <img
              src={user?.coverImg || "https://placehold.co/800x200"}
              alt="Banner"
              className="w-full h-full object-cover border-b-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent rounded-t-lg"></div>

            {/* Profile Picture & Edit Button */}
            <div className="absolute -bottom-16 left-4 md:left-8 flex items-center">
              {/* <img
              src={user?.profileImg || "https://placehold.co/150"}
              alt={user?.fullname || "User"}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-900 shadow-lg z-10"
            /> */}
              <div
                style={{
                  backgroundImage: `url(${
                    user?.profileImg || "https://placehold.co/800x200"
                  })`,
                }}
                className="w-28 h-28 md:w-32 md:h-32 bg-cover bg-center rounded-full border-4 border-gray-900 shadow-lg z-10"
              ></div>

              <div className="ml-4">
                {authUser?._id == user?._id ? (
                  <button
                    className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-full flex items-center space-x-2 transition"
                    onClick={handleEditProfile}
                  >
                    <FaUserEdit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-full flex items-center space-x-2 transition 
    ${
      user?.followers?.includes(authUser?._id)
        ? "bg-red-500 hover:bg-red-400"
        : "bg-blue-500 hover:bg-blue-400"
    }
  `}
                    onClick={() => follow(user?._id)}
                    disabled={isPending}
                  >
                    {isPending
                      ? "Processing..."
                      : user?.followers?.includes(authUser?._id)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="p-4 md:p-8 mt-16 md:mt-10">
          {isLoading ? (
            // <p>Loading profile...</p>
            <ProfileInfoSkeleton/>
          ) : 
          error ? (
            <p className="text-red-500">Error loading profile</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{user?.fullname || "User"}</h1>
              <p className="text-gray-400 text-sm">
                @{user?.username || "..."}
              </p>
              <p className="text-gray-300 mt-2">
                {user?.bio || "No bio available"}
              </p>

              <div className="flex space-x-6 mt-4 text-gray-400 text-sm">
                <div>
                  <span className="font-bold text-white">
                    {tweets?.length || 0}
                  </span>{" "}
                  Tweets
                </div>
                <div>
                  <span className="font-bold text-white">
                    {user?.followers?.length || 0}
                  </span>{" "}
                  Followers
                </div>
                <div>
                  <span className="font-bold text-white">
                    {user?.following?.length || 0}
                  </span>{" "}
                  Following
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tweets Filter Tabs */}
        {/* <div className="p-4">
          <h1>Tweets</h1>
        </div> */}

        <div className="p-4 md:p-8 md:pt-4">
          {authUser._id === user?._id ? (
            <div className="bg-gray-800 border-t border-gray-700 flex justify-around p-2 gap-2 rounded-lg">
              <button
                className={`p-3 flex-1 text-center rounded-lg ${
                  feedType === "Tweets" ? "text-blue-500" : "text-gray-400"
                } hover:bg-gray-700`}
                onClick={() => setFeedType("Tweets")}
              >
                Tweets
              </button>
              <button
                className={`p-3 flex-1 text-center rounded-lg ${
                  feedType === "Likes" ? "text-blue-500" : "text-gray-400"
                } hover:bg-gray-700`}
                onClick={() => {setFeedType("Likes")}}
              >
                Likes
              </button>
            </div>
          ) : (
            <div className="">
              <h2 className="text-xl font-bold mb-4">Tweets</h2>
            </div>
          )}

          {/* Tweets Section */}
          {tweetsLoading ? (
            // <p>Loading tweets...</p>
            <TweetSkeleton />
          ) : isError ? (
            <p className="text-red-500">Error loading tweets.</p>
          ) : tweets?.length > 0 ? (
            <TweetFeed tweets={tweets} />
          ) : (
            <p>No tweets available.</p>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <SidebarPhone />

      {/* Modals */}
      {selectedTweet && (
        <CommentDialog
          open={!!selectedTweet}
          onClose={() => setSelectedTweet(null)}
          tweet={selectedTweet}
        />
      )}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      <EditProfileDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        user={user}
        onUpdateProfile={updateUserPro} // Pass mutation function
        isUpdating={isProUpdated} // Pass loading state
      />

      <RightPanel />
    </div>
  );
}
