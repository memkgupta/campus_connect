"use client";

import { Trash } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FilePreview from "./file-preview";
import FileDetails from "./file-details";
import axios from "axios";
import { BACKEND_URL } from "@/constants";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";
import { NullExpression } from "mongoose";

const FileUpload = ({
  fileUrl,
  setLabel,
  setFileUrl,
  previewOpen,
  setPreviewOpen,
  fileType,
}: {
  fileUrl: string | null;
  previewOpen?:boolean
  setLabel?: (val: string) => void;
  setFileUrl: (val: string | NullExpression) => void;
  setPreviewOpen?:(val:boolean)=>void,
  fileType: string;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [fileData, setFileData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      toast({
        title: "Some error occurred",
        variant: "destructive",
      });
      return;
    }

    const f = e.target.files[0];
    const metadata = {
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
      lastModifiedDate: f.lastModified,
    };

    setFileData(metadata);
    setFile(f);
    setOpen(true);
  };

  const handleSave = async (fileB: Blob) => {
    if (file != null) {
      setIsUploading(true);
      try {
        const res = await axios.post(
          `${BACKEND_URL}/uploads/start`,
          {
            metaData: {
              title: file.name,
              type: "resource",
              mimeType: file.type,
              fileSize: file.size,
              protected: false,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access-token")}`,
            },
          }
        );

        const preSignedUrl = res.data.preSignedUrl;

        await axios.put(preSignedUrl, fileB, {
          headers: {
            "Content-Type": file.type,
          },
        });

        setFileUrl(res.data.url);
        setOpen(false);
      } catch (error) {
        console.log(error);
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.docx,.pptx"
        id="fileInput"
        hidden
      />

      {!file ? (
        <Button
          className="bg-yellow-300 text-black"
          onClick={() => {
            document.getElementById("fileInput")?.click();
          }}
        >
          Select files
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => {
            document.getElementById("fileInput")?.click();
          }}
        >
          Change File
        </Button>
      )}

      <Dialog open={open || previewOpen} onOpenChange={(v) =>{ setOpen(v);setPreviewOpen&&setPreviewOpen(false)}}>
        <DialogContent className="max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>File Preview</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4 flex-row">
            <div className="flex-grow max-h-[400px] max-w-[500px]">
              {file && <FilePreview file={file} />}
            </div>

            <div className="grid max-h-[200px] space-y-4">
              {file && (
                <p className="text-sm text-gray-600 font-medium">
                  Selected file: {file.name}
                </p>
              )}
              <FileDetails fileData={fileData} />
              <Button
                onClick={async () => {
                  await handleSave(file as File);
                }}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 00-10 10z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogClose asChild>
          <button className="hidden" />
        </DialogClose>
      </Dialog>
    </div>
  );
};

export default FileUpload;
