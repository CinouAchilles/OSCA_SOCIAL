import { Skeleton } from "@mui/material";

export default function TweetSkeleton() {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg mt-5">
      <div className="flex items-start space-x-4">
        {/* Profile Image Skeleton */}
        <Skeleton variant="circular" width={44} height={44} />

        <div className="flex-1">
          {/* Name & Username Skeleton */}
          <div className="flex items-center space-x-2">
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={80} height={16} />
          </div>

          {/* Content Skeleton */}
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />

          {/* Image Skeleton (if applicable) */}
          <Skeleton variant="rectangular" width="100%" height={200} className="mt-2 rounded-lg" />

          {/* Buttons Skeleton */}
          <div className="flex justify-between mt-3">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
