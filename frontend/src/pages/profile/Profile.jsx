import { useState } from "react";
import { FaHeart, FaComment, FaShare, FaUserEdit } from "react-icons/fa";
import Sidebar from "../../component/common/Sidebar";
import SidebarPhone from "../../component/common/SidebarPhone";

export default function ProfilePage() {
  // Example user data
  const user = {
    name: "John Doe",
    username: "JohnDoe",
    bio: "Software Developer | React Enthusiast | Cat Lover 🐱",
    profilePic: "https://placehold.co/150",
    bannerPic: "https://placehold.co/800x200",
    tweetsCount: 123,
    followersCount: 456,
    followingCount: 789,
    isOwner: true, // Change to false if viewing someone else's profile
  };

  // Example tweets data
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

  // Follow/unfollow state
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="min-h-screen flex text-white">
      <Sidebar />

      <div className="min-h-screen overflow-y-scroll h-screen scrollbar-custom md:w-auto  md:pb-0  md:mb-0 flex-1 pb-14 md:pb-0">
        {/* Profile Banner */}
        <div className="relative h-48 bg-gray-800">
          <img
            src={user.bannerPic}
            alt="Banner"
            className="w-full h-full object-cover border-b-[0.5px]"
          />
          {/* Add Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent rounded-t-lg"></div>

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-4 md:left-8 flex items-center">
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-900 shadow-lg z-10"
            />

            {/* Edit Profile or Follow Button */}
            <div className="ml-4">
              {user.isOwner ? (
                <button className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-full flex items-center space-x-2 transition">
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

        {/* Profile Info */}
        <div className="p-4 md:p-8 mt-16 md:mt-20">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-400 text-sm">@{user.username}</p>
          <p className="text-gray-300 mt-2">{user.bio}</p>

          {/* Stats */}
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

        {/* Tweets Section */}
        <div className="p-4 md:p-8">
          <h2 className="text-xl font-bold mb-4">Tweets</h2>
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition duration-300 border border-gray-700"
              >
                {/* Tweet Content */}
                <p className="text-gray-200">{tweet.content}</p>

                {/* Tweet Image */}
                {tweet.image && (
                  <img
                    src={tweet.image}
                    alt="Tweet"
                    className="w-full h-48 object-cover rounded-lg mt-3 border border-gray-700"
                  />
                )}

                {/* Tweet Stats */}
                <div className="flex items-center space-x-6 mt-3 text-gray-400 text-sm">
                  <div className="flex items-center space-x-2 cursor-pointer hover:text-red-500 transition">
                    <FaHeart className="w-4 h-4" />
                    <span>{tweet.likes}</span>
                  </div>
                  <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-500 transition">
                    <FaComment className="w-4 h-4" />
                    <span>{tweet.comments}</span>
                  </div>
                  <div className="flex items-center space-x-2 cursor-pointer hover:text-green-500 transition">
                    <FaShare className="w-4 h-4" />
                    <span>Share</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-gray-500 text-xs mt-2">
                  {tweet.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Adjustment */}
      <SidebarPhone />
    </div>
  );
}
