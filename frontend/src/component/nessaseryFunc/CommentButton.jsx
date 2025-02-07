import { FaComment } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CommentButton({ tweet, onOpenComment , CommentCount}) {
  

  const handleComment = () => {
    onOpenComment(tweet);
    // toast("Comment feature coming soon!", {
    //   icon: "💬",
    //   style: { background: "#333", color: "#fff" },
    // });
  };

  return (
    <button
      onClick={handleComment}
      className="flex items-center space-x-1 md:space-x-2 text-gray-400 hover:text-blue-500 transition"
    >
      <FaComment className="w-4 h-4 md:w-5 md:h-5" />
      <span className="text-sm md:text-base">{CommentCount}</span> {/* Replace with actual count */}
    </button>
  );
}
