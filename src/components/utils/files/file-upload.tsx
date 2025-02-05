"use client"

import { Trash } from 'lucide-react';
import { NullExpression } from 'mongoose';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FilePreview from './file-preview';
import PdfViewer from './pdf-viewer';
import FileDetails from './file-details';
import axios from 'axios';
import { BACKEND_URL } from '@/constants';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
const FileUpload = ({fileUrl,setLabel,setFileUrl,fileType}:{fileUrl:string|null,setLabel?:(val:string)=>void,setFileUrl:(val:string|NullExpression)=>void,fileType:string}) => {
 const [isHovered,setIsHovered] = useState(false);
 const [file,setFile] = useState<File|null>(null)
 const [open,setOpen] = useState(false);
 const [fileData,setFileData]=useState<any>(null);
 const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
  if(!e.target.files){
    toast({
title:"Some error occured",
variant:"destructive"
    })
    return;
  }
const f = e.target.files[0];
const metadata = {
  name: f.name,
  size: f.size, // in bytes
  type: f.type, // file MIME type (e.g., image/jpeg)
  lastModified: f.lastModified,
  lastModifiedDate: f.lastModified,
};
setFileData(metadata)
setFile(f);
setOpen(true)
 }
 const handleSave = async(fileB: Blob) => {
  if(file!=null){
    try {
      const res = await axios.post(`${BACKEND_URL}/uploads/start`,{
       metaData:{
        title:file!.name,
        type:"resource",
        mimeType:file!.type,
        fileSize:file!.size,
        protected:false,
       }
      },{
        headers:{
          "Authorization":`Bearer ${Cookies.get('access-token')}`
        }
      });
      const preSignedUrl = res.data.preSignedUrl;
      await axios.put(preSignedUrl,fileB,{headers:{
        "Content-Type":file.type
      }});
      console.log(res.data.url)
      setFileUrl(res.data.url);
      setOpen(false);
   
     } catch (error) {
      console.log(error)
      toast({
        title:"Something went wrong",
        variant:"destructive"
      })
     }
  }
  
 
 };
    return (
      <div>
        <input type='file' onChange={handleFileChange} accept='.pdf,.docx,.pptx' id='fileInput' hidden></input>
         <Button className='bg-yellow-300 text-black' onClick={()=>{
document.getElementById('fileInput')?.click()
         }}>Select files</Button> 
         <Dialog open={open} onOpenChange={(v)=>setOpen(v)}>
          <DialogContent className='max-w-[1000px]'>
            <DialogHeader>
              <DialogTitle>
                File Preview
              </DialogTitle>
            
            </DialogHeader>
          
            <div className='flex gap-2 flex-row'>
             <div className='flex-grow max-h-[400px] max-w-[500px]'>
             { 
            file &&  <FilePreview file={file}/>
             }
             </div>
             <div className='grid max-h-[200px]'>
              <FileDetails fileData={fileData}/>
              <Button onClick={async()=>{
                await handleSave(file as File)
              }}>
                Upload
              </Button>
             </div>
              </div>
          
          </DialogContent>
          <DialogClose asChild>Close</DialogClose>
         </Dialog>
      </div>
  )
}

export default FileUpload