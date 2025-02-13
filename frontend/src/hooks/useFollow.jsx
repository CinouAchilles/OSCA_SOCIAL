import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useFollow() {
  const queryClient = useQueryClient();

  const {
    mutate: follow,
    isError,
    isPending,
  } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(
          `/api/users/follow/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["getSeggested"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
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
  return {follow , isPending}
}
