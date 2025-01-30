import React, { useEffect, useState } from 'react'
import { Worker } from '@react-pdf-viewer/core';
// Import the main component
import { Viewer } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';

// Import styles
import '@react-pdf-viewer/zoom/lib/styles/index.css';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

const PdfViewer = ({file}:{file:string|File}) => {
   
    const [fileContent,setFileContent] = useState<any>(null)
    useEffect(()=>{
        if(file instanceof File){
          const reader = new FileReader();
          reader.onload = () => {
              if (reader.result) {
                setFileContent(reader.result as string); // The result is the base64 content
                console.log(reader.result);
              }
            };
          reader.readAsDataURL(file as File)
        }
        else{
            setFileContent(file)
        }
      },[])
  return (
    <div className='max-w-[700px] h-[400px]'>
{fileContent && <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
<Viewer  fileUrl={fileContent} />
</Worker>}
    </div>
  )
}

export default PdfViewer