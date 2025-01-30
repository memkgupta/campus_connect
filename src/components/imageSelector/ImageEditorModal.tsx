import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Upload, RotateCw, Sun, Contrast, Check, Crop, Circle, Square, X } from 'lucide-react';
import Cropper, { Area } from "react-easy-crop"
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { getCroppedImg } from './CanvasUtils';
interface ImageAdjustments {
  brightness: number;
  contrast: number;
  rotation: number;
  scale: number;
  x: number;
  y: number;
  isRound: boolean;
}

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRounded:boolean,
  onSave: (image: Blob) => void;
  initialImage: string|null;
  initialAdjustments?: ImageAdjustments;
  size?:{
    width:number,
    height:number
  }
}

export function ImageEditorModal({ isOpen,onSave, initialImage, initialAdjustments,isRounded,size }: ImageEditorModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);

 
  const [imageSrc, setImageSrc] = React.useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area|null>(null)
  
  const[brightness,setBrightness]=useState(0);
  const onCropComplete = (croppedArea:any, croppedAreaPixels:any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

 
  if (!isOpen) return null;

  return (
<>
<div className=''>
<div className='flex justify-center'>
{selectedImage ?   
<Cropper
style={
  { containerStyle:{width:size?size.width:"400px",height:size?size.height:"400px",marginRight:"auto",marginLeft:"auto",position:"relative"},mediaStyle:{
    filter:`brightness(${brightness+100}%)`
  }}
}
    image={selectedImage}
    crop={crop}
    cropShape={isRounded?'round':'rect'}
    zoom={zoom}
    aspect={size?(size.width/size.height):4/4}
  rotation={rotation}
    onCropChange={setCrop}
    onCropComplete={onCropComplete}
    onZoomChange={setZoom}
  />:<></>}
</div>
    <div className="controls mt-12 grid grid-cols-2 gap-4">
     <div className='flex gap-2 items-center justify-center'>
     <p >Zoom</p>
        <Slider
         className='w-[200px]'
          min={1}
          max={3}
          defaultValue={[zoom]}
          step={0.1}
          aria-labelledby="Zoom"
          onValueChange={(v)=>{setZoom(v[0])}}
       
        />
     </div>
     <div className='flex gap-2 items-center justify-center'>
     <p >Rotate</p>
        <Slider
         className='w-[200px]'
        
          defaultValue={[rotation]}
          min={0}
          max={360}
          step={1}
          aria-labelledby="Rotate"
          onValueChange={(v)=>{setRotation(v[0])}}
       
        />
     </div>
     <div className='flex gap-2 items-center justify-center'>
     <p >Brightness</p>
        <Slider
         className='w-[200px]'
          defaultValue={[brightness]}
          min={0}
          max={100}
          step={1}
          aria-labelledby="Brightness"
          onValueChange={(v)=>{setBrightness(v[0])}}
       
        />
     </div>
      </div>
      <div className='flex justify-end'>
        <Button onClick={async()=>{
          const croppedImage =await getCroppedImg(selectedImage!!,croppedAreaPixels!!,rotation)

          onSave(croppedImage as Blob)
        }}>Save</Button>
      </div>
</div>
</>
  );
}