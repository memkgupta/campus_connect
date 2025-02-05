import { Folder } from 'lucide-react'
import React from 'react'

const NoResourceFound = () => {
  return (
    <div className="flex items-center justify-center mt-20 ">
    <div className="bg-slate-950 border-2 border-gray-700 text-center p-6 rounded-lg shadow-lg max-w-sm">
      <Folder className="mx-auto mb-4 text-gray-400" size={48} />
      <h2 className="text-2xl font-bold mb-2 text-gray-800">No Resource Found</h2>
      <p className="text-gray-600">We couldn't find the resource you were looking for.</p>
    </div>
  </div>
  )
}

export default NoResourceFound