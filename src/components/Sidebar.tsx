"use client"
import { ArrowBigDown, ArrowDown, ArrowDownCircle, Book, Calendar, ChevronDown, ChevronUp, Droplet, Home, Info, MoveDown, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { useSession } from '@/hooks/useSession';

const Sidebar = ({show,setter}:{show:boolean,setter:any}) => {
    // const router = useRouter();
    const [query,setQuery] = useState('');
    // const {data:session,status} = useSession();
    const {isAuthenticated} = useSession();
    const handleInputChange = (e:any) => {
        setQuery(e.target.value);
      };
      
    const className = "bg-slate-950 w-[250px] transition-all ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40";
    const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";
    const MenuItem = ({ icon, name, route }:any) => {
        // Highlight menu item based on currently displayed route
        // const colorClass = router.pathname === route ? "text-white" : "text-white/50 hover:text-white";

        return (
            <Link
                href={route}
                onClick={() => {
                    setter((oldVal:any) => !oldVal);
                }}
                className={`flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-b-white/10`}
            >
                <div className="text-xl flex [&>*]:mx-auto w-[30px]">
                    {icon}
                </div>
                <div>{name}</div>
            </Link>
        )
    }

    const ModalOverlay = () => (
        <div
            className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
            onClick={() => {
                setter((oldVal:any) => !oldVal);
            }}
        />
    )

    const DropDown = ({list}:{list:{id:number,title:string,href:string}[]})=>{
        return (
          <div>
            {list.map(listItem=>(
                  <Link key={listItem.id}
                  href={listItem.href}
                  onClick={() => {
                      setter((oldVal:any) => !oldVal);
                  }}
                  className={`flex text-sm gap-1 [&>*]:my-auto text-md pl-6 py-3 `}
              >
                  {listItem.title}
              </Link>
            ))}
          </div>
        )
    }
    const[isResourceDropdownOpen,setIsResourceDropDownOpen] = useState(false);
  return (
    <>
    <div className={`${className} ${appendClass}`}>
        <div className="p-2 flex">
            <Link href="/">
                {/*eslint-disable-next-line*/}
                <img src={"/logo.png"} alt="Company Logo" width={300} height={300} />
            </Link>
        </div>
        <div className="flex flex-col">
            <MenuItem
                name="Home"
                route="/"
                icon={<Home />}
            />
      
          {/* <MenuItem
                name="Resources"
                route="/resources"
                icon={<Book />}
            > */}
            <div className='flex gap-4 items-center border-b-[1px] border-b-white/10'>
            <p 
       
                onClick={() => {
                    setter((oldVal:any) => !oldVal);
                }}
                className={`flex gap-1 cursor-pointer [&>*]:my-auto text-md pl-6 py-3 `}
            >
                <div className="text-xl flex [&>*]:mx-auto w-[30px]">
                    {<Book/>}
                </div>
                <div>Resources</div>
               
            </p>
           {isResourceDropdownOpen? <ChevronUp className='cursor-pointer' onClick={(e)=>{setIsResourceDropDownOpen(!isResourceDropdownOpen)}}/>:
            <ChevronDown className='cursor-pointer' onClick={(e)=>{setIsResourceDropDownOpen(!isResourceDropdownOpen)}}/>}
            </div>
            {isResourceDropdownOpen && (
                <div className='bg-slate-950 ml-4'>
                    <DropDown list={
                        [
                            {
                                title: "PYQ's",
                                href: "/resources/pyq",
                                id:
                                  1,
                              },
                              {
                                title: "Question Bank",
                                href: "/resources/question-bank",
                                id:2,
                              },
                              {
                                title: "Lectures",
                                href: "/resources/lectures",
                                id:3,
                              },
                              {
                                title: "Notes",
                                href: "/resources/notes",
                               id:4,
                              },
                              {
                                title: "Short Notes",
                                href: "/resources/short-notes",
                                id:4,
                              },
                              {
                                title: "Quantum",
                                href: "/resources/quantum",
                               id:5,
                              },  
                        
                        ]
                        }/>
                </div>
            )} 
        
          
          
            <MenuItem
                name="Events"
                route="/events"
                icon={<Calendar />}
            />
            <MenuItem
                name="About"
                route="/about"
                icon={<Info />}
            />
        { isAuthenticated? <MenuItem 
          name="Account"
          route="/dashboard"
          icon={<User/>}/>:<MenuItem
          name="Sign In"
        route="/sign-in" icon={<User/>}/>}
        </div>
        <div className=' gap-2 px-4 absolute bottom-3'>
        <div className="flex gap-2">
        <div className="relative w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border border-gray-300"
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
      </div>
      <Button  className='bg-yellow-300 text-black hover:bg-yellow-400'>Search</Button>
        </div>
      <p className='text-sm mt-4 text-center text-slate-800'>~Made by Mayank Gupta</p>
        </div>
       
    </div>
    {show ? <ModalOverlay /> : <></>}
</>
  )
}

export default Sidebar