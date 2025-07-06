'use client'
import { BACKEND_URL } from "@/constants";
import axios from "axios";
import React, { memo, useEffect, useState } from "react";
import "@cyntler/react-doc-viewer/dist/index.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { toast } from "./use-toast";

const CustomDocViewer = memo(({ src, fileName }: { src: string; fileName?: string }) => {
  const [url, setUrl] = useState<string | null>(null);

  const fetchUrl = async () => {
    try {
      const res = await axios.get(`${src}`);
      setUrl(res.data.url ? res.data.url : res.data);
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (src && src.startsWith(BACKEND_URL)) {
      fetchUrl();
    }
  }, [src]);

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 max-w-full md:max-w-3xl lg:max-w-4xl mx-auto">
      {url && (
        <DocViewer
          documents={[
            {
              uri: url,
              fileName: fileName || "file",
            },
          ]}
          config={{
            header: {
              disableFileName: true,
            },
          }}
          pluginRenderers={DocViewerRenderers}
          prefetchMethod="GET"
        />
      )}
    </div>
  );
});

export default CustomDocViewer;
