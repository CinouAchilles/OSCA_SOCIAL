export default function ProfileBannerSkeleton() {
    return (
      <div className="relative h-48 md:h-52 bg-gray-800 animate-pulse">
        <div className="w-full h-full bg-gray-700"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent rounded-t-lg"></div>
  
        {/* Profile Picture & Edit Button Skeleton */}
        <div className="absolute -bottom-16 left-4 md:left-8 flex items-center">
          <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-600 rounded-full border-4 border-gray-900 shadow-lg z-10"></div>
  
          <div className="ml-4">
            <div className="w-24 h-10 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }
  