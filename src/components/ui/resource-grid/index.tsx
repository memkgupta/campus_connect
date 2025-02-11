import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import Image from "next/image";

export function BentoGridSecondDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton1 = ({src}:{src:string}) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   bg-dot-white/[0.2]  [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-white/[0.2] bg-slate-900">
     <div
        className={cn(
          "w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
          `bg-[url(/notes.jpg)] bg-cover`
        )}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <div className="flex flex-row items-center space-x-4 z-10">
      
        
        </div>
        
      </div>
  </div>
);
const Skeleton2 = ({src}:{src:string}) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   bg-dot-white/[0.2]  [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-white/[0.2] bg-slate-900">
       <div
          className={cn(
            " cursor-pointer w-full overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
            `bg-[url(/quantum.jpg)] bg-cover`
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
          <div className="flex flex-row items-center space-x-4 z-10">
      
        
      </div>
      <div className="text content">
        <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
         
        </h1>
        <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
         
        </p>
      </div>
        </div>
    </div>
  );
  const Skeleton3 = ({src}:{src:string}) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   bg-dot-white/[0.2]  [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-white/[0.2] bg-slate-900">
       <div
          className={cn(
            " w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
            `bg-[url(/resources.jpg)] bg-fill`
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        
        </div>
    </div>
  );
  const Skeleton4 = ({src}:{src:string}) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   bg-dot-white/[0.2]  [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-white/[0.2] bg-slate-900">
       <div
          className={cn(
            "w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
            `bg-[url(/lecture.jpg)] bg-cover`
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
       
        </div>
    </div>
  );
const items = [
  {
    title: "Notes",
    description: "Find the notes uploaded by other students and faculty.",
    header: <Skeleton1 src="notes.jpg" />,
    className: "md:col-span-2",
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Quantums",
    description: "Find quantum for various subjects.",
    header: <Skeleton2 src="resources.jpg" />,
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "PYQ's",
    description: "Previous year question papers.",
    header: <Skeleton3 src="pyq.jpg" />,
    className: "md:col-span-1",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Lectures",
    description:
      "The best YT lectures sorted for you.",
    header: <Skeleton4 src="lecture.jpg" />,
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
];
