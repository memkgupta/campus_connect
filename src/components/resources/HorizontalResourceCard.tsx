export default function HorizontalResourceCard({ data }:{data:{details:{
   thumbnail:string,label:string,category:string,type:string,branch:string,sessionYear:string,code:string,updatedAt:Date
},upvoteCount:number,downvoteCount:number,}}) {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex bg-blue-900 text-white shadow-md rounded-lg overflow-hidden">
          {/* Thumbnail */}
          <div className="w-24">
            <img
              src={data.details.thumbnail || "/placeholder-thumbnail.jpg"}
              alt="Thumbnail"
              className="h-full w-full object-cover"
            />
          </div>
  
          {/* Content */}
          <div className="flex-1 p-3">
            {/* Label & Type */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium truncate">
                {data.details.label || "No Label"}
              </h2>
              <span className="bg-blue-700 text-xs px-2 py-1 rounded">
                {data.details.type || "Unknown"}
              </span>
            </div>
  
            {/* Branch & Session Year */}
            <p className="text-sm text-gray-300 mt-1">
              Branch: {data.details.branch}, Session: {data.details.sessionYear}
            </p>
  
            {/* Code */}
            <div className="mt-2">
              <p className="text-sm text-gray-400">Code:</p>
              <p className="bg-blue-800 text-xs px-2 py-1 rounded mt-1">
                {data.details.code || "N/A"}
              </p>
            </div>
  
            {/* Footer: Upvotes, Downvotes */}
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
              {/* Optional additional information */}
            </div>
          </div>
        </div>
      </div>
    );
  }
  