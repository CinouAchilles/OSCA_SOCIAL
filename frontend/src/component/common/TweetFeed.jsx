import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaUser,
  FaTrash,
  FaBookmark,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import CommentDialog from "./CommentDialog";
import ImageModal from "./ImageModal";

export default function TweetFeed({ tweets, onDeleteTweet }) {
  const [likedTweets, setLikedTweets] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [savedTweets, setSavedTweets] = useState({});
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

  const handleLike = (tweetId) => {
    setLikedTweets((prev) => ({
      ...prev,
      [tweetId]: !prev[tweetId], // Toggle like status
    }));
    setLikeCounts((prev) => ({
      ...prev,
      [tweetId]: prev[tweetId] ? prev[tweetId] - 1 : (prev[tweetId] || 0) + 1,
    }));
    toast.success(likedTweets[tweetId] ? "Unliked tweet" : "Liked tweet", {
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleComment = (tweet) => {
    setSelectedTweet(tweet);
    toast("Comment feature coming soon!", {
      icon: "💬",
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleShare = (tweetId) => {
    toast("Share feature coming soon!", {
      icon: "🔗",
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleSave = (tweetId) => {
    setSavedTweets((prev) => ({
      ...prev,
      [tweetId]: !prev[tweetId], // Toggle save status
    }));
    toast.success(
      savedTweets[tweetId] ? "Removed from saved tweets" : "Saved tweet",
      {
        style: {
          background: "#333",
          color: "#fff",
        },
      }
    );
  };

  const handleDelete = (tweetId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tweet?"
    );
    if (confirmDelete) {
      onDeleteTweet(tweetId);
      toast.success("Tweet deleted successfully", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Open the image in the lightbox
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
            {/* Profile Picture */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </div>

            {/* Tweet Content */}
            <div className="flex-1">
              {/* User Info */}
              <div className="flex mb-5 md:mb-2 md:flex-row md:items-center space-x-2 space-y-1 md:space-y-0 md:space-x-2">
                <span className="font-bold text-base md:text-lg hover:underline cursor-pointer">
                  {tweet.user}
                </span>
                <span className="text-gray-400 text-sm">@{tweet.user}</span>
                <span className="text-gray-400 text-sm">· 2h</span>
              </div>

              {/* Tweet Text */}
              <div className="text-gray-200 mt-1 text-sm md:text-base">
                {tweet.content}
              </div>

              {/* Tweet Image */}
              {tweet.image && (
                <div
                  className="mt-2 cursor-pointer"
                  onClick={() => handleImageClick(URL.createObjectURL(tweet.image))}
                >
                  <img
                    src={URL.createObjectURL(tweet.image)}
                    alt="Tweet"
                    className="w-full h-32 md:h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-3 space-x-2 md:space-x-4">
                {/* Like Button */}
                <button
                  onClick={() => handleLike(tweet.id)}
                  className="flex items-center space-x-1 md:space-x-2 text-gray-400 hover:text-red-500 transition"
                >
                  {likedTweets[tweet.id] ? (
                    <FaHeart className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                  <span className="text-sm md:text-base">
                    {likeCounts[tweet.id] || 0}
                  </span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => handleComment(tweet)}
                  className="flex items-center space-x-1 md:space-x-2 text-gray-400 hover:text-blue-500 transition"
                >
                  <FaComment className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">23</span>{" "}
                  {/* Replace with actual comment count */}
                </button>

                {/* Save Button */}
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

                {/* Delete Button */}
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

      {/* Comment Dialog */}
      {selectedTweet && (
        <CommentDialog
          open={!!selectedTweet}
          onClose={() => setSelectedTweet(null)}
          tweet={selectedTweet}
        />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
