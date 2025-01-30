import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CustomImage from './ui/image'

const SearchResult = ({label,thumbnail,sub,href}:{label:string,thumbnail?:string,sub?:string,href:string}) => {
  return (
    <Link href={href} className='bg-slate-800 p-2 rounded-md border border-white w-full flex gap-2'>
    {thumbnail && <CustomImage alt='' src={thumbnail} width={20} height={20} className='rounded-full'/>}
    <div className='grid gap-y-1 flex-1'>
<p className='text-white text-md'>{label}</p>
<p className='text-gray-500 text-xs'>{sub}</p>
    </div>
    </Link>
  )
}

export default SearchResult