import { useEffect, useState } from "react";
import Sidebar from "../../component/common/Sidebar";
import RightPanel from "../../component/common/RightPanel";
import PostTweet from "./PostTweet";
import TweetFeed from "../../component/common/TweetFeed";
import Xsvg from "../../component/svgs/x";
import SidebarPhone from "../../component/common/SidebarPhone";
import { CircularProgress } from "@mui/material";
import useFetchTweets from "../../hooks/useFetchTweets";

export default function HomePage() {
  const [feedType, setFeedType] = useState("forYou");
  const [tweets, setTweets] = useState([]);

  const { data: postsfetched, isLoading, isError } = useFetchTweets(feedType);

  useEffect(() => {
    if (postsfetched) {
      const formattedPosts = postsfetched.map((post) => ({
        id: post._id,
        userId: post.user._id,
        username: post.user.username,
        fullname: post.user.fullname,
        content: post.text,
        images: post.img,
        likes: post.likes,
        comments: post.comments,
        createdAt: post.createdAt,
      }));

      setTweets(formattedPosts);
    }
  }, [postsfetched]);

  const handlePostTweet = (content, image) => {
    const newTweet = {
      id: tweets.length + 1,
      user: "CurrentUser",
      content,
      image,
    };
    setTweets([newTweet, ...tweets]);
  };

  const handleDeleteTweet = (tweetId) => {
    setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId));
    console.log("Tweet to delete:", tweetId);
  };

  return (
    <div className="flex min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 md:w-4/5 lg:w-3/5 p-4 border-r border-gray-700 overflow-y-scroll h-screen scrollbar-custom">
        <div className="flex md:hidden mb-5 gap-2 items-center">
          <Xsvg className="w-12 h-12 text-blue-400" />
          <h1 className="text-2xl font-bold ">Home</h1>
        </div>
        <h1 className="text-2xl font-bold mb-4 hidden md:block">Home</h1>

        <PostTweet
          onPostTweet={handlePostTweet}
          onDeleteTweet={handleDeleteTweet}
        />

        <div className="bg-gray-800 border-t border-gray-700 flex justify-around p-2 gap-2 rounded-lg">
          <button
            className={`p-3 flex-1 text-center rounded-lg ${
              feedType === "forYou" ? "text-blue-500" : "text-gray-400"
            } hover:bg-gray-700`}
            onClick={() => setFeedType("forYou")}
          >
            For You
          </button>
          <button
            className={`p-3 flex-1 text-center rounded-lg ${
              feedType === "following" ? "text-blue-500" : "text-gray-400"
            } hover:bg-gray-700`}
            onClick={() => setFeedType("following")}
          >
            Following
          </button>
        </div>

        <div className="overflow-y-scroll scrollbar-hide mb-12 md:mb-0 ">
          {isError ? (
            <div className="flex justify-center items-center h-full">
              <p>Error loading tweets. Please try again.</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress color="primary" />
            </div>
          ) : tweets.length > 0 ? (
            <TweetFeed tweets={tweets} onDeleteTweet={handleDeleteTweet} />
          ) : (
            <div className="flex justify-center items-center h-full">
              <p>No tweets available.</p>
            </div>
          )}
        </div>
      </div>

      <RightPanel />
      <SidebarPhone />
    </div>
  );
}
