'use client'
import { BACKEND_URL } from "@/constants";
import axios from "axios";
import React, { forwardRef, memo, useEffect, useState } from "react";
import "@cyntler/react-doc-viewer/dist/index.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { toast } from "./use-toast";


const CustomDocViewer = memo(({src}:{src:string}) => {
    const [url,setUrl] = useState(null);

    const fetchUrl = async()=>{
      try {
        const res = await axios.get(`${src}`);
        setUrl(res.data.url?res.data.url:res.data);
      } catch (error) {
        toast({
            title:"Something went wrong",
            variant:"destructive"
        })
        return;
      }
    }
            useEffect(()=>{
    if(src){
        if(src.startsWith(BACKEND_URL)){
           fetchUrl();
        }
        console.log("Re rendered")
    }
    return ()=>{}
            },[src])
        return(
        <div className="max-w-[1000px] px-24 w-full">
        {url && <DocViewer documents={[
            {uri:url}
            
        ]}
        config={{
          header: {
          
            disableFileName: true,
      
          },
        
        }} 
        pluginRenderers={DocViewerRenderers} prefetchMethod="GET" />}
        </div>
    )
})

export default CustomDocViewer