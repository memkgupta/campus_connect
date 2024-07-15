import Link from 'next/link'
import React from 'react'

const ActiveCourse = ({data}:{data:any}) => {
  return (
    <Link href={`/courses/${data._id}`} className='bg-slate-950 rounded-md my-2'>
        <p className='font-bold text-md'>{data.title}</p>
      
    </Link>
  )
}

export default ActiveCourse