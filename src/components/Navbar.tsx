"use client"
import React, { useEffect, useRef, useState } from 'react'
// import { useSession,signOut } from 'next-auth/react'
import { useSession } from '@/hooks/useSession';
import {User} from "next-auth"
import Image from 'next/image';
import { NavigationMenuDemo } from './navigation-menu';
import { Cross, CrossIcon, HamIcon, Loader2, MenuIcon, Search, User2, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Link from 'next/link';
import { Button } from './ui/button';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useDebounceCallback } from 'usehooks-ts';
import { document } from 'postcss';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import SearchResult from './search-results';
import SearchBar from './search-bar';
function Navbar() {

   
const {user,isAuthenticated} = useSession();


const[isMenuOpen,setIsMenuOpen] = useState(false);


// const user:User = session?.user;
const [isSearching,setIsSearching] = useState(false);
const [isOpen,setIsOpen] = useState(false);
const searchRef = useRef(null)
const [isFocused, setIsFocused] = useState(false);

  return (
  <>
    <div className='z-40 flex items-center  justify-between w-full text-yellow-300 bg-slate-950 px-4'>
        <Image src={"/logo.png"} width={70} height={70} alt='logo'/>
        <div className='md:block hidden'>
<NavigationMenuDemo/>
        </div>
        <div className='md:flex hidden gap-x-4'>
      
     <SearchBar/>
   {<div className='mr-2'>
    {isAuthenticated?<Link className='bg-gray-400 rounded-full w-14 h-12 flex justify-center items-center' href={"/dashboard"}><User2 size={40} color='yellow'/></Link>:<Button className='bg-yellow-300  hover:bg-yellow-400 '><Link href={"/auth/sign-in"} className=''>Sign in</Link></Button>}
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


