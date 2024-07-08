import React from 'react'

const Input = ({label,placeholder}:{label:string,placeholder:string}) => {
  return (
    <div className="relative">
    <input
      type="text"
      id="shadcn-input"
      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
      placeholder={placeholder}
    />
    <label
      htmlFor="shadcn-input"
      className="absolute top-0 left-0 px-2 mt-2 ml-4 text-gray-500 bg-white pointer-events-none"
    >
      {label}
    </label>
  </div>
  )
}

export default Input