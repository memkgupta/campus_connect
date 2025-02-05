import React, { useEffect, useState } from 'react'
import DocViewer ,{ DocViewerRenderers }from "react-doc-viewer";
import PdfViewer from './pdf-viewer';
const FilePreview = ({file}:{file:File}) => {
    const [fileURI,setFileURI] = useState<any>(null);
    useEffect(()=>{
        const reader = new FileReader()
        reader.onload = ()=>{
            if(reader.result){
                setFileURI(reader.result as string);
            }
            
        }
        reader.readAsArrayBuffer(file);
    },[])
  return (
    <div>
    {file.type=="application/pdf"?<PdfViewer file={file}></PdfViewer>:""}
    </div>
  )
}

export default FilePreview