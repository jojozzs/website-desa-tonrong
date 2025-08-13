export function LoadingState() {
  return (
    <div className="space-y-8">
      {/* Loading Banner */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-64 lg:h-80 bg-gray-200 animate-pulse"></div>
        <div className="p-8">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Loading Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    </div>
  )
}