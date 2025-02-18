import Sidebar from "../../component/common/Sidebar";
import SidebarPhone from "../../component/common/SidebarPhone";
import RightPanel from "../../component/common/RightPanel";
import toast, { Toaster } from "react-hot-toast";
import useGetAllSaved from "../../hooks/useGetAllSaved";
import TweetFeed from "../../component/common/TweetFeed";
import TweetSkeleton from "../../component/skeletons/TweetSkeleton";
import { FaBookmark } from "react-icons/fa"; // Importing the bookmark icon

export default function Bookmarks() {
  const { getsavedtweets, isError, isLoading, error } = useGetAllSaved();
  return (
    <div className="min-h-screen flex text-white bg-[#030712]">
      <Toaster />
      <Sidebar />
      <div className="min-h-screen overflow-y-scroll border-r border-gray-700 h-screen scrollbar-custom md:w-auto md:mb-0 flex-1 pb-14 md:pb-0  p-4 md:p-6">
        <div className="flex items-center space-x-2 mb-6">
          <FaBookmark className="w-6 h-6" />
          <h1 className="text-2xl font-bold text-white">
            Bookmarks
          </h1>
        </div>

        {/* Error Handling */}
        {isError && <p className="text-red-500">{error?.message}</p>}

        <div className="mb-2 md:mb-5">
          {/* Loading Skeleton */}
          {isLoading ? (
            <TweetSkeleton />
          ) : (
            <div className="space-y-4">
              {getsavedtweets?.length === 0 ? (
                <p className="text-gray-400">No saved posts found.</p>
              ) : (
                <TweetFeed tweets={getsavedtweets} />
              )}
            </div>
          )}
        </div>
      </div>

      <SidebarPhone />
      <RightPanel />
    </div>
  );
}
