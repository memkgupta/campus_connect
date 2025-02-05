import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from './ui/use-toast';
import { Loader2, Search } from 'lucide-react';
import SearchResult from './search-results';

const SearchBar = () => {
    const [query, setQuery] = useState('');
const debounced = useDebounceCallback(setQuery,500);
const [searchType,setSearchType] = useState('resources')
const [searchResult,setSearchResult] = useState<{label:string,href:string,thumbnail:string|undefined,sub:string|undefined}[]>([]);
const {toast} = useToast();
const [isSearching,setIsSearching] = useState(false);
const [isFocused, setIsFocused] = useState(false);
const handleInputChange = (e:any) => {
    // if(e.target.value)
   
    if(e.target.value.length>0){
      setIsSearching(true)
    }
    else{
      setIsSearching(false)
    }
    if(e.target.value.length==1){
      if(e.target.value==='@'){
        setSearchType('users');
      }
      else {
        setSearchType('resources');
      }
  
    }
   
    if(!e.target.value.startsWith('@')){
  debounced(e.target.value);
    }
    else{
      debounced(e.target.value.slice(1));
    }
  };
  useEffect(()=>{
  
    const fetchResults = async()=>{
      try {
        if(query.length>0){
          const res = await axios.get(`/api/search`,{params:{type:searchType,query:query}});
       setSearchResult(res.data.results);
        }
    else{
      setSearchResult([]);
    }
      } catch (error) {
        toast({
          title:"Some error occured",
          variant:'destructive'
        })
      }
      finally{
        setIsSearching(false);
      }
    }
    fetchResults();
  },[query])
return (
    <div className='relative'>
    <div className="relative flex items-center h-full w-full ">
      <input
        type="text"
       
        onFocus={()=>{setIsFocused(true)}}
        onBlur={()=>{setIsFocused(false)}}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 text-black py-2 rounded-l-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white "
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
    {(isFocused||searchResult.length>0)&&<div className='absolute z-40 top-14 rounded-md bg-slate-950 p-2 w-full'>
      {isSearching?(
        <div className='flex w-full h-full items-center justify-center'>
<Loader2 className='text-gray-700 animate-spin'/>
        </div>
        
      ):(<>
      {searchResult.length==0?(<>No Results</>):(<>
      {searchResult.map(res=><SearchResult href={res.href} label={res.label} sub={res.sub} thumbnail={res.thumbnail}  key={res.href}/>)}
      </>)}
      </>)}
    </div>}
    </div>
  )
}

export default SearchBar