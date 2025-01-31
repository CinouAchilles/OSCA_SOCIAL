import Skeleton from "@mui/material/Skeleton";

export default function RightPanelSkeleton() {
  return (
    <div className="w-full hidden lg:block md:w-1/5 p-4">
      {/* Skeleton for Title */}
      <h2 className="text-xl font-bold mb-4">Who to follow</h2>

      {/* Skeleton for Suggested Users */}
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Skeleton for Profile Image */}
                <Skeleton variant="circular" width={40} height={40} />

                {/* Skeleton for User Info */}
                <div>
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="text" width={80} height={15} />
                </div>
              </div>

              {/* Skeleton for Follow Button */}
              <Skeleton variant="rounded" width={80} height={35} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
