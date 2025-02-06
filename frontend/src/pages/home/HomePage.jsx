import { useEffect, useState } from "react";
import Sidebar from "../../component/common/Sidebar";
import RightPanel from "../../component/common/RightPanel";
import PostTweet from "./PostTweet";
import TweetFeed from "../../component/common/TweetFeed";
import Xsvg from "../../component/svgs/x";
import SidebarPhone from "../../component/common/SidebarPhone";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";

export default function HomePage() {
  const [feedType, setFeedType] = useState("forYou");
  const [tweets, setTweets] = useState([]);

  const getEndPoint = (feedType) => {
    switch (feedType) {
      case "forYou":
        return "http://localhost:3000/api/posts/all";
      case "following":
        return "http://localhost:3000/api/posts/followingposts";
      default:
        return "http://localhost:3000/api/posts/all";
    }
  };

  const POST_ENDPOINT = getEndPoint(feedType);
  const {
    data: postsfetched,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["tweets", feedType],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
  });

  useEffect(() => {
    if (postsfetched) {
      const formattedPosts = postsfetched.map((post) => ({
        id: post._id,
        userId: post.user._id,
        username: post.user.username,
        fullname: post.user.fullname,
        content: post.text,
        images: post.img, // Assuming no images are provided in the API response
        likes: post.likes,
        comments: post.comments,
        createdAt: post.createdAt,
      }));

      setTweets(formattedPosts); // Directly set the new fetched tweets
    }
  }, [postsfetched]);

  const handlePostTweet = (content, image) => {
    const newTweet = {
      id: tweets.length + 1,
      user: "CurrentUser", // Replace with logged-in user's username
      content,
      image,
    };
    setTweets([newTweet, ...tweets]);
  };

  let handleDeleteTweet = (tweetId) => {
    setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId));
    console.log("Tweet to delete:", tweetId);
  };

  return (
    <div className="flex min-h-screen text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Feed */}
      <div className="flex-1 md:w-4/5 lg:w-3/5 p-4 border-r border-gray-700 overflow-y-scroll h-screen scrollbar-custom">
        <div className="flex md:hidden mb-5 gap-2 items-center">
          <Xsvg className="w-12 h-12 text-blue-400" />
          <h1 className="text-2xl font-bold ">Home</h1>
        </div>
        <h1 className="text-2xl font-bold mb-4 hidden md:block">Home</h1>

        {/* Post a Tweet */}
        <PostTweet
          onPostTweet={handlePostTweet}
          onDeleteTweet={handleDeleteTweet}
        />
        {/* Bottom Navigation */}
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

        {/* Tweet Feed (Scrolls) */}
        <div className="overflow-y-scroll scrollbar-hide mb-12 md:mb-0 ">
          {isError ? (
            <div className="flex justify-center items-center h-full">
              <p>Error loading tweets. Please try again.</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-full">
              {/* MUI Loader (CircularProgress) */}
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

      {/* Suggested Users Section */}
      <RightPanel />

      {/* Mobile Bottom Navigation */}
      <SidebarPhone />
    </div>
  );
}
