import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useGetAllSaved() {
  const queryClient = useQueryClient();

  const { data: getsavedtweets, isError, isLoading, error } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/savedposts", {
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

        return data;
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
  });

  return { getsavedtweets, isError, isLoading, error };
}
