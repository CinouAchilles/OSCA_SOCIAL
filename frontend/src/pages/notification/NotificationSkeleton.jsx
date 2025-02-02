import { Skeleton } from "@mui/material";

export default function NotificationSkeleton() {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex items-start space-x-4">
        {/* Profile Pic Skeleton */}
        <Skeleton variant="circular" width={48} height={48} className="bg-gray-700" />

        {/* Text Skeleton */}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height={20} className="bg-gray-700" />
          <Skeleton variant="text" width="40%" height={16} className="bg-gray-700" />
        </div>

        {/* Icon Skeleton */}
        <Skeleton variant="circular" width={24} height={24} className="bg-gray-700" />
      </div>
    </div>
  );
}
