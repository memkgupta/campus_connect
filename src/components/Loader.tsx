import { Loader2 } from 'lucide-react'
import React from 'react'

const Loader = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
            <Loader2 className='text-gray-600 animate-spin'/>
        </div>
  )
}

export default Loader