import { Link } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import { BsSearch } from "react-icons/bs";

export default function RightPanel() {
  const { follow, isPending } = useFollow();
  const [searchMode, setSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch authenticated user
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  // Fetch suggested users
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

  // Get all users function
  const {
    mutate: getAllUsers,
    isPending: allPending,
    isError: allError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/search", {
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
    onSuccess: (data) => {
      setAllUsers(data); // Store all users in state
      setFilteredUsers(data); // Initialize filtered users with all users
    },
  });

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      const filtered = allUsers.filter((user) =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered); // Update filtered users
    } else {
      setFilteredUsers(allUsers); // Reset to all users if search term is empty
    }
  };

  // Fetch all users when component mounts
  useEffect(() => {
    getAllUsers();
  }, []);

  if (isLoading) return <RightPanelSkeleton />;
  if (isError)
    return <div className="text-red-500 p-4">Failed to load suggestions.</div>;

  // Ensure getSeggested is always an array before mapping
  const users = Array.isArray(getSeggested) ? getSeggested : [];

  const renderSearchInput = () => (
    <TextField
      autoFocus
      variant="outlined"
      size="small"
      placeholder="Search users..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onBlur={() => !searchTerm && setSearchMode(false)}
      onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
      className="w-full"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "999px",
          color: "white",
        },
        input: { color: "white" },
      }}
    />
  );

  const renderTitle = () => (
    <h2 className="text-xl font-semibold">Who to follow</h2>
  );


  // there is problem when i press search and try to click on sertain profile it does not redirect to that profile
  // unless i write something in the search bar and then click on the profile
  // even if its space or any other character
  return (
    <div className="w-full hidden lg:block md:w-1/5 p-3 min-h-screen overflow-y-scroll h-screen scrollbar-custom">
      <div className="flex justify-between items-center mb-3 ">
        {searchMode ? renderSearchInput() : renderTitle()}

        <IconButton onClick={() => setSearchMode(!searchMode)}>
          <BsSearch className="text-gray-400" />
        </IconButton>
      </div>
      <div className="space-y-3">
        {searchMode && filteredUsers.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : searchMode ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="p-3 bg-gray-800 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.profileImg || "https://placehold.co/150"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <Link to={`/profile/${user?.username || "wronguser"}`}>
                      <div className="text-md font-semibold hover:underline cursor-pointer">
                        {user.fullname}
                      </div>
                    </Link>
                    <div className="text-sm text-gray-400">
                      @{user.username}
                    </div>
                  </div>
                </div>
                <button
                  className={`px-3 py-1.5 text-white text-sm font-medium rounded-full transition transform hover:scale-105 focus:scale-95 ${
                    user?.followers?.includes(authUser?._id)
                      ? "bg-red-500 hover:bg-red-400"
                      : "bg-blue-500 hover:bg-blue-400"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    follow(user._id);
                  }}
                >
                  {isPending
                    ? "Loading..."
                    : user?.followers?.includes(authUser?._id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            </div>
          ))
        ) : users.length === 0 ? (
          <p className="text-gray-400">No suggestions available.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="p-3 bg-gray-800 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.profileImg || "https://placehold.co/150"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <Link to={`/profile/${user?.username || "wronguser"}`}>
                      <div className="text-md font-semibold hover:underline cursor-pointer">
                        {user.fullname}
                      </div>
                    </Link>
                    <div className="text-sm text-gray-400">
                      @{user.username}
                    </div>
                  </div>
                </div>
                <button
                  className={`px-3 py-1.5 text-white text-sm font-medium rounded-full transition transform hover:scale-105 focus:scale-95 ${
                    user?.followers?.includes(authUser?._id)
                      ? "bg-red-500 hover:bg-red-400"
                      : "bg-blue-500 hover:bg-blue-400"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    follow(user._id);
                  }}
                >
                  {isPending
                    ? "Loading..."
                    : user?.followers?.includes(authUser?._id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
