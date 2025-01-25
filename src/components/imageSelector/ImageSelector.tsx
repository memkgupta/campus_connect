import React, { useState } from 'react';
import { ImageEditorModal } from './ImageEditorModal';
import { Upload, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { toast } from '../ui/use-toast';
import axios from 'axios';
import { BACKEND_URL } from '@/constants';
import Cookies from 'js-cookie';
import { useSession } from '@/hooks/useSession';
import CustomImage from '../ui/image';
interface ImageAdjustments {
  brightness: number;
  contrast: number;
  rotation: number;
  scale: number;
  x: number;
  y: number;
  isRound: boolean;
}

export function ImageEditor({preview,isRound,type,title,setImage}:{preview:string|null,isRound:boolean,type:string,title?:string,setImage:(url:string)=>void}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(preview);
  const [isChanged,setIsChanged] = useState(false);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 100,
    contrast: 100,
    rotation: 0,
    scale: 2,
    x: 0,
    y: 0,
    isRound: isRound
  });

  const handleSave = async(image: Blob) => {
   try {
    const res = await axios.post(`${BACKEND_URL}/uploads/start`,{
     metaData:{
      title:title?title:`${type} image from user`,
      type:type,
      mimeType:image.type,
      fileSize:image.size,
      protected:false,
     }
    },{
      headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
      }
    });
    const preSignedUrl = res.data.preSignedUrl;
    await axios.put(preSignedUrl,image,{headers:{
      "Content-Type":image.type
    }});
    console.log(res.data.url)
    setImage(res.data.url);
    setSelectedImage(res.data.url);

    setIsChanged(false);
   } catch (error) {
    console.log(error)
    toast({
      title:"Something went wrong",
      variant:"destructive"
    })
   }
  
  };
 
  // reader.readAsArrayBuffer()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file

    if (file) {
      const reader = new FileReader();

      // On file load, update the image URL state
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result); 
          setIsChanged(true)
        }
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <div   className="max-w-md mx-auto p-6">
      <input style={{ display: "none" }} onChange={handleFileChange} type='file' accept='image/jpeg' id='profileSelector_file'/>
      <div 
        onClick={()=>{document.getElementById('profileSelector_file')?.click()}}
        className={`border-2 border-dashed border-gray-300 text-center cursor-pointer hover:border-blue-500 transition-colors relative ${adjustments.isRound ? 'rounded-full' : 'rounded-lg'}`}
        style={{ height: '200px', width: '200px', margin: '0 auto',objectFit:'contain' }}
      >
        {selectedImage ? (
          <>
            <div 
         
              className={`absolute inset-0 overflow-hidden ${adjustments.isRound ? 'rounded-full' : 'rounded-lg'}`}
            >
              
                <CustomImage
                  src={selectedImage}
                
                  className="max-w-none"
                    alt="Selected"
                  width={"100%"}
                  height={"100%"}
                  draggable="false"
                />
     
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
              <Pencil   className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-600 text-sm">Click to add image</p>
          </div>
        )}
      </div>
   {isChanged && <Dialog defaultOpen={isChanged} open={isChanged} onOpenChange={(e)=>setIsChanged(e)}>
      
      <DialogContent className="max-h-screen max-w-screen">
       
        <ImageEditorModal
        
       isRounded={isRound}
        isOpen={isChanged}
        onClose={() => setIsChanged(false)}
        onSave={handleSave}
        initialImage={selectedImage}
        initialAdjustments={adjustments}
      />
        <DialogFooter>
          <DialogClose asChild>
          <Button  type="submit">Close</Button>
          </DialogClose>
         
        </DialogFooter>
      </DialogContent>
    </Dialog>}
     
    </div>
  );
}