import { CircleX } from 'lucide-react'
import React from 'react'

const ErrorLoadingPage = () => {
  return (
    <div className="flex items-center justify-center mt-20 ">
    <div className="bg-slate-950 border-2 border-gray-700 text-center p-6 rounded-lg shadow-lg max-w-sm">
      <CircleX className="mx-auto mb-4 text-gray-400" size={48} />
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Error Loading page</h2>
      <p className="text-gray-600">We couldn't load the page.</p>
    </div>
  </div>
  )
}

export default ErrorLoadingPage