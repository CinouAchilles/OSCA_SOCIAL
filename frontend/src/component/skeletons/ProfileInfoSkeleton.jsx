export default function ProfileInfoSkeleton() {
    return (
      <div className="p-4 animate-pulse">
        <div className="w-40 h-6 bg-gray-600 rounded"></div>
        <div className="w-28 h-4 bg-gray-700 rounded mt-2"></div>
        <div className="w-full h-12 bg-gray-700 rounded mt-4"></div>
  
        <div className="flex space-x-6 mt-4 text-sm">
          <div className="w-16 h-4 bg-gray-700 rounded"></div>
          <div className="w-16 h-4 bg-gray-700 rounded"></div>
          <div className="w-16 h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  