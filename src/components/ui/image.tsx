import { BACKEND_URL } from "@/constants";
import axios from "axios";
import React, { useEffect, useState, forwardRef } from "react";

interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  // No need to define `src` here, it's already part of `ImgHTMLAttributes`
}

const CustomImage = forwardRef<HTMLImageElement, CustomImageProps>(({ src, className, ...props }, ref) => {
  const [imageUrl, setImageUrl] = useState<string>(src!);
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
  const [error, setError] = useState<boolean>(false); // To handle any errors during image fetch
if(!src){
    return <></>
}
  const fetchImage = async () => {
    try {
      // Fetch image data if it's a backend URL
      const req = await axios.get(src!, { responseType: 'text' });

      setImageUrl(req.data);
    } catch (err) {
      console.error("Error fetching image:", err);
      setError(true); // Set error flag if the image can't be fetched
    } finally {
      setLoading(false); // Stop loading once the request is done
    }
  };

  useEffect(() => {
    if (src!.startsWith(BACKEND_URL)) {
      fetchImage();
    }
    else{
        setImageUrl(src)
    }
   
  }, [src]); // Added `src` as dependency to fetch again if the `src` prop changes

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a custom loader
  }

  if (error) {
    return <div>Failed to load image</div>; // Handle image load failure gracefully
  }

  return (
    <img
      ref={ref}
      src={imageUrl}
      className={className}
      {...props} // Spread any other props like alt, width, height, etc.
    />
  );
});

CustomImage.displayName = "CustomImage"; // Set display name for debugging

export default CustomImage;
