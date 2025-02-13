import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useLogout(){
    const queryClient = useQueryClient();
    const { mutateAsync: logoutMutation } = useMutation({
        mutationFn: async () => {
          const res = await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          if (!res.ok) {
            throw new Error("Failed to log out");
          }
          return res.json(); 
        },
        onSuccess: () => {
          queryClient.setQueryData(["authUser"], null);
          queryClient.invalidateQueries(["authUser"]);
          console.log("✅ User logged out");
        },
        onError: (error) => {
          console.error("❌ Error logging out:", error.message);
        },
      });

    return {logoutMutation}
}