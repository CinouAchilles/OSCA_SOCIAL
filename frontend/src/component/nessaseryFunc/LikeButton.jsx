import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

export default function LikeButton({ tweetId, initialLikes = 0 , LikesCount }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    toast.success(liked ? "Unliked tweet" : "Liked tweet", {
      style: { background: "#333", color: "#fff" },
    });
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center space-x-1 md:space-x-2 text-gray-400 hover:text-red-500 transition"
    >
      {liked ? (
        <FaHeart className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
      ) : (
        <FaRegHeart className="w-4 h-4 md:w-5 md:h-5" />
      )}
      <span className="text-sm md:text-base">{LikesCount}</span>
    </button>
  );
}
