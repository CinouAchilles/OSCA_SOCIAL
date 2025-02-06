import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";

export default function RightPanel() {
  const {
    data: getSeggested,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getSeggested"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/seggested", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went Wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
  });

  if (isLoading) return <RightPanelSkeleton />;
  if (isError)
    return <div className="text-red-500 p-4">Failed to load suggestions.</div>;

  // ✅ Ensure getSeggested is always an array before mapping
  const users = Array.isArray(getSeggested) ? getSeggested : [];

  return (
    <div className="w-full hidden lg:block md:w-1/5 p-3">
      <h2 className="text-xl font-semibold mb-3">Who to follow</h2>
      <div className="space-y-3">
        {users.length === 0 ? (
          <p className="text-gray-400">No suggestions available.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="p-3 bg-gray-800 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.profileImg}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-md font-semibold">{user.fullname}</div>
                    <div className="text-sm text-gray-400">@{user.username}</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-gray-700 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition transform hover:scale-105 focus:scale-95">
                  Follow
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
