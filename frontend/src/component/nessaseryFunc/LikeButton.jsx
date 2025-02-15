import { useState } from "react";
import { CircularProgress } from "@mui/material"; // ✅ Loading Indicator
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function LikeButton({ tweetId, LikesCount, checkliked }) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(checkliked);
  const [likeCount, setLikeCount] = useState(LikesCount);

  const { mutate: like, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${tweetId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong!");
        return data;
      } catch (error) {
        throw new Error(error.message || "Network error")
      }
    },

    onSuccess: (data) => {
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

      toast.success(data.message, {
        style: { background: "#333", color: "#fff" },
      });

      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },

    onError: (error) => {
      toast.error(error.message, {
        style: { background: "#333", color: "#fff" },
      });
    },
  });

  const handleLike = () => {
    if (isPending) return; // Prevent multiple clicks
    like();
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center space-x-1 md:space-x-2 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
      disabled={isPending}
    >
      {isPending ? (
        <CircularProgress size={16} color="inherit" /> 
      ) : liked ? (
        <FaHeart className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
      ) : (
        <FaRegHeart className="w-4 h-4 md:w-5 md:h-5" />
      )}
      <span className="text-sm md:text-base">{likeCount}</span>
    </button>
  );
}
