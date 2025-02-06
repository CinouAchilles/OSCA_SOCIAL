import { useState } from "react";
import { FaUser, FaTrash, FaBookmark } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import CommentDialog from "./CommentDialog";
import CommentButton from "../nessaseryFunc/CommentButton";
import TweetImage from "../nessaseryFunc/TweetImage";
import LikeButton from "../nessaseryFunc/LikeButton";
import ImageModal from "./ImageModal";
import { formatDistanceToNowStrict } from "date-fns";

export default function TweetFeed({ tweets = [], onDeleteTweet }) {
  const [savedTweets, setSavedTweets] = useState({});
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSave = (tweetId) => {
    setSavedTweets((prev) => ({
      ...prev,
      [tweetId]: !prev[tweetId],
    }));
    toast.success(
      savedTweets[tweetId] ? "Removed from saved tweets" : "Saved tweet",
      {
        style: { background: "#333", color: "#fff" },
      }
    );
  };

  const handleDelete = (tweetId) => {
    if (window.confirm("Are you sure you want to delete this tweet?")) {
      onDeleteTweet(tweetId);
      toast.success("Tweet deleted successfully", {
        style: { background: "#333", color: "#fff" },
      });
    }
  };

  return (
    <div className="space-y-4">
      <Toaster />
      {tweets.map((tweet) => (
        <div
          key={tweet.id}
          className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </div>

            <div className="flex-1">
              <div className="flex mb-5 md:mb-2 md:flex-row md:items-center space-x-2 space-y-1 md:space-y-0 md:space-x-2">
                <span className="font-bold text-base md:text-lg hover:underline cursor-pointer">
                  {tweet.user}
                </span>
                <span className="text-gray-400 text-sm">@{tweet.user}</span>
                <span className="text-gray-400 text-sm">
                  · {formatDistanceToNowStrict(new Date(tweet.createdAt))} ago
                </span>
              </div>

              <div className="text-gray-200 mt-1 text-sm md:text-base">
                {tweet.content}
              </div>

              <TweetImage image={tweet.image} onImageClick={setSelectedImage} />

              <div className="flex items-center justify-between mt-3 space-x-2 md:space-x-4">
                <LikeButton tweetId={tweet.id} />
                <CommentButton tweet={tweet} onOpenComment={setSelectedTweet} />

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

                <button
                  onClick={() => handleDelete(tweet.id)}
                  className="flex items-center space-x-1 md:space-x-2 text-gray-400 hover:text-red-600 transition"
                >
                  <FaTrash className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Delete</span>
                </button>
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
