import { useState, useEffect } from "react";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";

export default function RightPanel() {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setSuggestedUsers([
        {
          id: 1,
          fullName: "John Doe",
          username: "JohnDoe",
          profilePic: "https://placehold.co/150",
        },
        {
          id: 2,
          fullName: "Jane Smith",
          username: "JaneSmith",
          profilePic: "https://placehold.co/150",
        },
        {
          id: 3,
          fullName: "Alice Johnson",
          username: "AliceJ",
          profilePic: "https://placehold.co/150",
        },
      ]);
      setLoading(false);
    }, 2000); // Simulate API call delay
  }, []);

  if (loading) {
    return <RightPanelSkeleton />;
  }

  return (
    <div className="w-full hidden lg:block md:w-1/5 p-3">
      <h2 className="text-xl font-semibold mb-3">Who to follow</h2>
      <div className="space-y-3">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="p-3 bg-gray-800 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="text-md font-semibold">{user.fullName}</div>
                  <div className="text-sm text-gray-400">@{user.username}</div>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-[#787878] text-white text-sm font-medium rounded-full hover:bg-blue-600 transition transform hover:scale-105 focus:scale-95">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
