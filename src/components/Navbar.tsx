"use client"
import React, { useState } from 'react'
import { useSession,signOut } from 'next-auth/react'
import {User} from "next-auth"
import Image from 'next/image';
import { NavigationMenuDemo } from './NavigationMenu';
import { Cross, CrossIcon, HamIcon, MenuIcon, Search, User2, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Link from 'next/link';
import { Button } from './ui/button';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
function Navbar() {

   
const {data:session,status} = useSession();
const [query, setQuery] = useState('');
const[isMenuOpen,setIsMenuOpen] = useState(false);
const handleInputChange = (e:any) => {
  setQuery(e.target.value);
};

// const user:User = session?.user;


  
  return (
  <>
    <div className='z-20 flex items-center justify-between w-full text-yellow-300 bg-slate-950 px-4'>
        <Image src={"/logo.png"} width={70} height={70} alt='logo'/>
        <div className='md:block hidden'>
<NavigationMenuDemo/>
        </div>
        <div className='md:flex hidden gap-x-4'>
      
      <div className="relative flex items-center h-full w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-2 rounded-l-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white "
          placeholder="Search..."
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35m1.41-5.41A7.5 7.5 0 1110.5 3.5a7.5 7.5 0 017.5 7.5z"
          ></path>
        </svg>
        <button className='h-10 px-2 bg-yellow-300 rounded-r-md'><Search color='black'/></button>
      </div>
   {<div className='mr-2'>
    {status==="authenticated"?<Link className='bg-gray-400 rounded-full w-14 h-12 flex justify-center items-center' href={"/account"}><User2 size={40} color='yellow'/></Link>:<Button className='bg-yellow-300  hover:bg-yellow-400 '><Link href={"/auth/sign-in"} className=''>Sign in</Link></Button>}
   </div> }
        </div>
        <div className='sm:block md:hidden '>
      {isMenuOpen ?  <X className='cursor-pointer' onClick={(e)=>{setIsMenuOpen(!isMenuOpen)}} color='gray' size={40}/>
           : <MenuIcon className='cursor-pointer' onClick={(e)=>{setIsMenuOpen(!isMenuOpen)}} color='gray' size={40}/>
           }
        </div>
        {isMenuOpen &&
        (
<div className='md:hidden'>
<Sidebar show={isMenuOpen} setter={setIsMenuOpen}/>
</div>
   

        )}
       
    </div>
    <ProgressBar
          height="4px"
          color="#fffd00"
          options={{ showSpinner: false }}
          shallowRouting
        />
  </>
  )
}

export default Navbar


