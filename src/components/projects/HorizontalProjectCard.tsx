export default function HorizontalProjectCard({data}:{data:{details:{
    banner:string,title:string,openForCollab:boolean,category:string,tags:string[],updatedAt:Date
},upvoteCount:number,downvoteCount:number,}}) {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex bg-blue-900 text-white shadow-md rounded-lg overflow-hidden">
          {/* Banner */}
          <div className="w-24">
            <img
              src={data.details.banner || "/placeholder-banner.jpg"}
              alt="Banner"
              className="h-full w-full object-cover"
            />
          </div>
  
          {/* Content */}
          <div className="flex-1 p-3">
            {/* Title */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium truncate">
                {data.details.title || "No Title"}
              </h2>
              {data.details.openForCollab ? (
                <span className="bg-green-500 text-xs px-2 py-1 rounded">
                  Open
                </span>
              ) : (
                <span className="bg-red-500 text-xs px-2 py-1 rounded">
                  Closed
                </span>
              )}
            </div>
  
            {/* Category */}
            <p className="text-sm text-gray-300 mt-1">
              Category: {data.details.category}
            </p>
  
            {/* Tags */}
            <div className="mt-2 flex flex-wrap gap-1">
              {data.details.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-700 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {data.details.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{data.details.tags.length - 3}</span>
              )}
            </div>
  
            {/* Footer: Upvotes, Downvotes, Updated At */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-green-400">▲</span>
                  <span>{data.upvoteCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-400">▼</span>
                  <span>{data.downvoteCount}</span>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(data.details.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  