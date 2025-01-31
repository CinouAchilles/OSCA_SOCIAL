import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { FaBell, FaBookmark, FaHashtag, FaHome, FaUser } from "react-icons/fa";
import Sidebar from "../../component/common/Sidebar";
import RightPanel from "../../component/common/RightPanel";

export default function HomePage() {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([
    { id: 1, user: "JohnDoe", content: "This is my first tweet!" },
    { id: 2, user: "JaneDoe", content: "Hello Twitter clone!" },
  ]);

  const handlePostTweet = () => {
    if (tweet.trim() === "") {
      alert("Tweet cannot be empty!");
      return;
    }
    const newTweet = {
      id: tweets.length + 1,
      user: "CurrentUser", // Replace with logged-in user's username
      content: tweet,
    };
    setTweets([newTweet, ...tweets]);
    setTweet("");
  };

  return (
    <div className="flex min-h-screen  text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Feed */}
      <div className="w-full md:w-4/5 lg:w-3/5 p-4 border-r border-gray-700">
        <h1 className="text-2xl font-bold mb-4">Home</h1>

        {/* Post a Tweet */}
        <div className="mb-6">
          <textarea
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows="3"
            placeholder="What's happening?"
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handlePostTweet}
              className="flex items-center space-x-2 p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              <AiOutlinePlus className="w-5 h-5" />
              <span>Tweet</span>
            </button>
          </div>
        </div>

        {/* Tweet Feed */}
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <FaUser className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">{tweet.user}</div>
                  <div className="text-gray-400">{tweet.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users Section  */}
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
