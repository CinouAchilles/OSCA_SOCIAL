import Skeleton from "@mui/material/Skeleton";

export default function RightPanelSkeleton() {
  return (
    <div className="w-full hidden lg:block md:w-1/5 p-3">
      {/* Skeleton for Title */}
      <h2 className="text-xl font-semibold mb-3">Who to follow</h2>

      {/* Skeleton for Suggested Users */}
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-3 bg-gray-800 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Skeleton for Profile Image */}
                <Skeleton variant="circular" width={36} height={36} />

                {/* Skeleton for User Info */}
                <div>
                  <Skeleton variant="text" width={90} height={18} />
                  <Skeleton variant="text" width={60} height={14} />
                </div>
              </div>

              {/* Skeleton for Follow Button */}
              <Skeleton variant="rounded" width={70} height={30} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
