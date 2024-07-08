import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
const f = createUploadthing();
const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
      // Set permissions and file types for this FileRoute
      
      .onUploadComplete(async ({ metadata, file }:{metadata:any,file:any}) => {
        // This code RUNS ON YOUR SERVER after upload
       
          console.log("Upload complete for userId:", metadata.userId);
   
          console.log("file url", file.url);
          return { uploadedBy: metadata.userId };
        
       
   
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        
      }),
  } satisfies FileRouter;
   
  export type OurFileRouter = typeof ourFileRouter;