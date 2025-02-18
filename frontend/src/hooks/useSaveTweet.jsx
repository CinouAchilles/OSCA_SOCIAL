import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSaveTweet() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (tweetId) => {
      try {
        const res = await fetch("/api/users/savepost", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ tweetId }),
        });
        
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        
        return data;
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || "Tweet saved!", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      // Optionally invalidate queries or update local state
      queryClient.invalidateQueries(["authUser"]);
      queryClient.invalidateQueries(["savedPosts"]);
      queryClient.invalidateQueries(["Tweets"]);
    },
    onError: (error) => {
      toast.error(error.message, {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  return { saveTweet: mutation.mutate };
}
