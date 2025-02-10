import { useState } from "react";
import { FaUser, FaTrash, FaBookmark } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import CommentDialog from "./CommentDialog";
import CommentButton from "../nessaseryFunc/CommentButton";
import TweetImage from "../nessaseryFunc/TweetImage";
import LikeButton from "../nessaseryFunc/LikeButton";
import ImageModal from "./ImageModal";
import { formatDistanceToNowStrict } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function TweetFeed({ tweets = [], onDeleteTweet }) {
  const [savedTweets, setSavedTweets] = useState({});
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const handleSave = (tweetId) => {
    // setSavedTweets((prev) => ({
    //   ...prev,
    //   [tweetId]: !prev[tweetId],
    // }));
    // toast.success(
    //   savedTweets[tweetId] ? "Removed from saved tweets" : "Saved tweet",
    //   {
    //     style: { background: "#333", color: "#fff" },
    //   }
    // );
    toast("Save feature coming soon!", {
      icon: "💬",
      style: { background: "#333", color: "#fff" },
    });
  };


  const { mutate: deletePost } = useMutation({
    mutationFn: async (idToDelete) => {
      try {
        const res = await fetch(`http://localhost:3000/api/posts/${idToDelete}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Network error");
        }
        return data;
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
    onSuccess: (data, idToDelete) => {
      toast.success("Tweet deleted successfully", {
        style: { background: "#333", color: "#fff" },
      });
      // Call the onDeleteTweet callback after the deletion is successful
      onDeleteTweet(idToDelete); // Pass the tweet ID to the parent
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        style: { background: "#333", color: "#fff" },
      });
    },
  });

  const handleDelete = (tweetId) => {
    deletePost(tweetId)
  };

  return (
    <div className="space-y-4">
      <Toaster />
      {tweets.map((tweet) => (
        <div
          key={tweet.id || tweet._id}
          className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </div>

            <div className="flex-1">
              <div className="flex mb-5 md:mb-2 md:flex-row md:items-center space-x-2 space-y-1 md:space-y-0 md:space-x-2">
                <span className="font-bold text-base md:text-lg hover:underline cursor-pointer">
                  {tweet.fullname || tweet.user.fullname}
                </span>
                <span className="text-gray-400 text-sm">@{tweet.username || tweet.user.username}</span>
                <span className="text-gray-400 text-sm">
                  · {formatDistanceToNowStrict(new Date(tweet.createdAt))} ago
                </span>
              </div>

              <div className="text-gray-200 mt-1 text-sm md:text-base">
                {tweet.content || tweet.text}
              </div>

              <TweetImage image={tweet.images || tweet.img} onImageClick={setSelectedImage} />

              <div className="flex items-center justify-between mt-3 space-x-2 md:space-x-4">
                <LikeButton tweetId={tweet.id || tweet._id} LikesCount={tweet.likes.length} checkliked={tweet.likes.includes(authUser._id)}/>
                <CommentButton tweet={tweet} onOpenComment={setSelectedTweet} CommentCount={tweet.comments.length} />

                <button
                  onClick={() => handleSave(tweet.id)}
                  className="flex items-center space-x-1 md:space-x-2 text-gray-400 hover:text-yellow-500 transition"
                >
                  {savedTweets[tweet.id] ? (
                    <FaBookmark className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                  ) : (
                    <FaBookmark className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                  <span className="text-sm md:text-base">Save</span>
                </button>

                {authUser && authUser._id == (tweet.userId || tweet.user._id) && (
                  <button
                    onClick={() => handleDelete(tweet.id)}
                    className="flex items-center space-x-1 md:space-x-2 text-gray-400 hover:text-red-600 transition"
                  >
                    <FaTrash className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

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
    </div>
  );
}
