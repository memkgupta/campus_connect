"use client"
import { UploadButton } from '@/utils/uploadthing';
import { Trash } from 'lucide-react';
import { NullExpression } from 'mongoose';
import React, { useState } from 'react'
{/* <UploadButton
     className='mt-4 col-span-2 ut-button:text-black ut-button:bg-yellow-400 ut-button:ut-readying:bg-yellow-500/50 '
         endpoint="fileUploader"
         disabled={fileUrl!=''}
        
         onClientUploadComplete={(res) => {
          
           setLabel && setLabel(res[0].name);
   setFileUrl(res[0].url);
          
         }}
         onUploadError={(error: Error) => {
           
           alert(`ERROR! ${error.message}`);
         }}

       /> */}
const FileUpload = ({fileUrl,setLabel,setFileUrl,fileType}:{fileUrl:string|null,setLabel?:(val:string)=>void,setFileUrl:(val:string|NullExpression)=>void,fileType:string}) => {
 const [isHovered,setIsHovered] = useState(false);
    return (

       <div onMouseEnter={()=>{
        setIsHovered(true)
    }} onMouseLeave={()=>{setIsHovered(false)}} className={`relative w-full col-span-2 mx-auto rounded-md h-[200px] mb-4 flex items-center justify-center ${!fileUrl && 'bg-slate-900/50' }`} onClick={(e)=>{
      if(fileUrl){
        setFileUrl(null);
      }
    }} >
{fileUrl&&fileType=="img"&&<img src={fileUrl} className='w-full h-full'/>}
        {isHovered && fileUrl&&fileType=="img" && (
    <div className="absolute cursor-pointer inset-0 rounded-md flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity">
    <Trash size={40}/>
    </div>
        )}
        <UploadButton
   className={`${fileUrl&&'hidden'} mt-2`}
   
   endpoint="fileUploader"
   onClientUploadComplete={(res) => {
   setFileUrl(res[0].url)
   }}
   onUploadError={(error: Error) => {
     // Do something with the error.
     alert(`ERROR! ${error.message}`);
   }}
 />
</div>
  )
}

export default FileUpload