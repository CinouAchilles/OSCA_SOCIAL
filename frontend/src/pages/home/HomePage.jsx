import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaBookmark, FaHashtag, FaHome, FaUser } from "react-icons/fa";
import Sidebar from "../../component/common/Sidebar";
import RightPanel from "../../component/common/RightPanel";
import PostTweet from "./PostTweet";
import TweetFeed from "../../component/common/TweetFeed";
import Xsvg from "../../component/svgs/x";

export default function HomePage() {
    const [tweets, setTweets] = useState([
        {
          id: 1,
          user: "JohnDoe",
          content: "This is my first tweet!",
          images: [], // Add images here
        },
        {
          id: 2,
          user: "JaneDoe",
          content: "Hello Twitter clone!",
          images: [], // Add images here
        },
      ]);

  const handlePostTweet = (content, image) => {
    const newTweet = {
      id: tweets.length + 1,
      user: "CurrentUser", // Replace with logged-in user's username
      content,
      image,
    };
    setTweets([newTweet, ...tweets]);
  };

  const handleDeleteTweet = (tweetId) => {
    setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId));
  };


  return (
    <div className="flex min-h-screen text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Feed */}
      <div className="w-full md:w-4/5 lg:w-3/5 p-4 border-r border-gray-700 overflow-y-scroll h-screen scrollbar-custom">
        <div className="flex md:hidden mb-5 gap-2 items-center">
          <Xsvg className="w-12 h-12 text-blue-400" />
          <h1 className="text-2xl font-bold ">Home</h1>
        </div>
        <h1 className="text-2xl font-bold mb-4 hidden md:block">Home</h1>

        {/* Post a Tweet */}
        <PostTweet onPostTweet={handlePostTweet} onDeleteTweet={handleDeleteTweet} />

        {/* Tweet Feed (Scrolls) */}
        <div className="overflow-y-scroll scrollbar-hide mb-12 md:mb-0 ">
          <TweetFeed tweets={tweets} />
        </div>
      </div>

      {/* Suggested Users Section */}
      <RightPanel />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 md:hidden">
        <div className="flex justify-around p-2">
          <Link to="/home" className="p-2 hover:bg-gray-700 rounded-lg">
            <FaHome className="w-6 h-6" />
          </Link>
          <Link to="/explore" className="p-2 hover:bg-gray-700 rounded-lg">
            <FaHashtag className="w-6 h-6" />
          </Link>
          <Link
            to="/notifications"
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <FaBell className="w-6 h-6" />
          </Link>
          <Link to="/bookmarks" className="p-2 hover:bg-gray-700 rounded-lg">
            <FaBookmark className="w-6 h-6" />
          </Link>
          <Link to="/profile" className="p-2 hover:bg-gray-700 rounded-lg">
            <FaUser className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
