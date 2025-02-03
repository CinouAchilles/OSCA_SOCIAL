import { useState } from "react";
import { FaShare, FaUserEdit } from "react-icons/fa";
import Sidebar from "../../component/common/Sidebar";
import SidebarPhone from "../../component/common/SidebarPhone";
import toast, { Toaster } from "react-hot-toast";
import CommentDialog from "../../component/common/CommentDialog";
import TweetImage from "../../component/nessaseryFunc/TweetImage";
import LikeButton from "../../component/nessaseryFunc/LikeButton";
import CommentButton from "../../component/nessaseryFunc/CommentButton";
import ImageModal from "../../component/common/ImageModal";
import EditProfileDialog from "./EditProfileDialogComp";

export default function ProfilePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState(null);


  const handleEditProfile = () => {
    setOpenEditDialog(true);
  };

  const user = {
    name: "John Doe",
    username: "JohnDoe",
    bio: "Software Developer | React Enthusiast | Cat Lover 🐱",
    profilePic: "https://placehold.co/150",
    bannerPic: "https://placehold.co/800x200",
    tweetsCount: 123,
    followersCount: 456,
    followingCount: 789,
    isOwner: true,
  };

  const tweets = [
    {
      id: 1,
      content: "This is my first tweet!",
      image: null,
      likes: 10,
      comments: 2,
      timestamp: "2h ago",
    },
    {
      id: 2,
      content: "Hello Twitter clone!",
      image: "https://placehold.co/600x400",
      likes: 25,
      comments: 5,
      timestamp: "5h ago",
    },
  ];


  return (
    <div className="min-h-screen flex text-white">
      <Toaster />
      <Sidebar />

      <div className="min-h-screen overflow-y-scroll h-screen scrollbar-custom md:w-auto md:mb-0 flex-1 pb-14 md:pb-0">
        <div className="relative h-48 bg-gray-800">
          <img
            src={user.bannerPic}
            alt="Banner"
            className="w-full h-full object-cover border-b-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent rounded-t-lg"></div>

          <div className="absolute -bottom-16 left-4 md:left-8 flex items-center">
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-900 shadow-lg z-10"
            />

            <div className="ml-4">
              {user.isOwner ? (
                <button 
                className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-full flex items-center space-x-2 transition"
                onClick={handleEditProfile}
                >
                  <FaUserEdit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                    isFollowing
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 mt-16 md:mt-10">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-400 text-sm">@{user.username}</p>
          <p className="text-gray-300 mt-2">{user.bio}</p>

          <div className="flex space-x-6 mt-4 text-gray-400 text-sm">
            <div>
              <span className="font-bold text-white">{user.tweetsCount}</span>{" "}
              Tweets
            </div>
            <div>
              <span className="font-bold text-white">
                {user.followersCount}
              </span>{" "}
              Followers
            </div>
            <div>
              <span className="font-bold text-white">
                {user.followingCount}
              </span>{" "}
              Following
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <h2 className="text-xl font-bold mb-4">Tweets</h2>
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition duration-300 border border-gray-700"
              >
                <p className="text-gray-200">{tweet.content}</p>

                {/* Use TweetImage component */}
                <TweetImage
                  image={tweet.image}
                  onImageClick={setSelectedImage}
                />

                <div className="flex items-center space-x-6 mt-3 text-gray-400 text-sm">
                  {/* Use LikeButton component */}
                  <LikeButton tweetId={tweet.id} initialLikes={tweet.likes} />

                  {/* Use CommentButton component */}
                  <CommentButton
                    tweet={tweet}
                    onOpenComment={() => {
                      if (tweet) {
                        setSelectedTweet(tweet); // Ensure tweet is valid before setting it
                      }
                    }}
                  />

                  <div className="flex items-center space-x-2 cursor-pointer hover:text-green-500 transition"
                  onClick={()=>toast.success("Share feature coming soon!",{
                    icon: <FaShare className="text-white" />,
                    style: { background: "#333", color: "#fff" },
                  })}
                  >
                    <FaShare className="w-4 h-4" />
                    <span>Share</span>
                  </div>
                </div>

                <div className="text-gray-500 text-xs mt-2">
                  {tweet.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SidebarPhone />

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
      />
    </div>
  );
}
