import { BACKEND_URL } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import Cookies from 'js-cookie'
const ActiveCourse = () => {
  const [courses,setCourses] = useState([])
  const fetchActiveCourses = async()=>{
    try {
      const res = await axios.get(`${BACKEND_URL}/tracker/courses?limit=3&page=1`,{headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
      }});
      if(res.data.success){
        setCourses(res.data.courses)
        return res.data.courses; 
      }
    } catch (error) {
     return []
    }
// return {courses:[]}
  }

const _d = useQuery({
  queryKey:[],
  queryFn:fetchActiveCourses,
  refetchOnWindowFocus:false
})
  return (
<>
{
courses.length>0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-3 py-3 text-white">
    {courses.map((course:any) => (
      <div key={course._id} className="max-w-sm rounded overflow-hidden shadow-lg bg-slate-800 p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="mb-4">
        {/* Course Title */}
        <Link href={`/lectures/${course.resource_id}`} className="text-xs font-bold mb-2 text-white">{course.title}</Link>
        {/* Course Description */}
        <p className="text-white text-sm">
          {course.description}
        </p>
      </div>

      {/* Active Status */}
      {/* {course.isActive ? (
        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wide">
          Active
        </span>
      ) : (
        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wide">
          Inactive
        </span>
      )} */}

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 w-full bg-gray-300 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${(course.taken/course.totalLectures)*100}%` }}
          ></div>
        </div>
        <p className="text-sm text-white mt-1">
          Progress: {(course.taken/course.totalLectures)*100}%
        </p>
      </div>
    </div>
    ))}
  </div>
  )
}
</>
  )
}

export default ActiveCourse

