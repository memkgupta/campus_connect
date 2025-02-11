import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
// import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled, IconRegistered, IconReportAnalytics } from "@tabler/icons-react";
import Link from "next/link";
import { BentoGridSecondDemo } from "./resource-grid";
import { BentoGridThirdDemo } from "./guid-grid";
import { ArrowRight, Bell, Calendar, ListTodo, MessageSquare, Puzzle, Users } from "lucide-react";
import { BackgroundLines } from "./background-lines";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Manage clubs and events Effectively",
      description:
        "Manage clubs and events from registration to analytics with campus connect efficiently",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-3 border-b lg:border-r border-neutral-800",
    },
    {
      title: "Academic Resources",
      description:
        "Access notes, books, and study materials—all in one place!",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-3 border-neutral-800",
    },
    {
        title: "Roadmaps,articles and guides",
        description:
          "Never miss out on workshops, fests, and important announcements!",
        skeleton: <SkeletonFive />,
        className:
          "col-span-1 lg:col-span-4 lg:border-r border-neutral-800",
    },
    {
      title: "Stay Updated on Campus Events",
      description:
        "Never miss out on workshops, fests, and important announcements!",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-2 lg:border-r border-neutral-800",
    },
   
    {
      title: "Project Collaboration",
      description:
        "Showcase your projects and find project partners to collaborate with",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-6 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        
        <h4 className="text-3xl font-bold lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight  text-white">
          Packed with Many features
        </h4>
        

        <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto  text-center font-normal text-neutral-300">
        Campus Connect is built for students, by students—designed to make collaboration seamless. You can add more features through open-source contributions!
        </p>
      </div>

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl font-bold  text-left tracking-tight text-yellow-400 text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        " text-center font-normal text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full  p-5  mx-auto bg-slate-950 shadow-2xl group h-full">
        <div className="flex flex-1 w-full h-full flex-col   ">
          {/* TODO */}
          <Image
            src="/event-management.png"
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
          />
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-slate-950 via-slate-950 to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonThree = () => {
    const images = [
      "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];
   
    const imageVariants = {
      whileHover: {
        scale: 1.1,
        rotate: 0,
        zIndex: 100,
      },
      whileTap: {
        scale: 1.1,
        rotate: 0,
        zIndex: 100,
      },
    };
    return (
        <div className="bg-slate-950 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 max-w-md mx-auto">
        <div className="flex flex-col gap-6">
          {/* Main Image */}
          <div className="relative aspect-video w-full">
            <img 
              src="/event.webp"
              alt="Calendar View"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent rounded-lg"></div>
          
          </div>
  
          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
            
            </div>
  
            <p className="text-gray-300 text-sm leading-relaxed">
              Stay updated with all campus activities, events, and important notifications in one place.
            </p>
  
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg">
                <Bell className="w-5 h-5 text-yellow-400 shrink-0" />
                <span className="text-gray-300 text-sm">Notifications</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg">
                <ListTodo className="w-5 h-5 text-yellow-400 shrink-0" />
                <span className="text-gray-300 text-sm">Event Listing</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg">
                <IconRegistered className="w-5 h-5 text-yellow-400 shrink-0" />
                <span className="text-gray-300 text-sm">Event Registration</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg">
                <IconReportAnalytics className="w-5 h-5 text-yellow-400 shrink-0" />
                <span className="text-gray-300 text-sm">Event Management</span>
              </div>
            </div>
  
            <div className="flex items-center justify-between pt-2">
              <div className="flex -space-x-2">
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=100"
                  alt="Event Sample"
                  className="w-8 h-8 rounded-full border-2 border-slate-950 object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=100"
                  alt="Notification Sample"
                  className="w-8 h-8 rounded-full border-2 border-slate-950 object-cover"
                />
                <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-yellow-400 flex items-center justify-center text-slate-950 text-xs font-medium">
                  +3
                </div>
              </div>
              <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors">
                <span className="text-sm font-medium">Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
   
export const SkeletonTwo = () => {
  
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      {/* TODO */}
    <BentoGridSecondDemo/>

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-slate-950 to-transparent  h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-slate-950 to-transparent h-full pointer-events-none" />
    </div>
  );
};
export const SkeletonFive = () => {
  
    return (
      <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
        {/* TODO */}
      <BentoGridThirdDemo/>
  
        <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-slate-950 to-transparent  h-full pointer-events-none" />
        <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-slate-950 to-transparent h-full pointer-events-none" />
      </div>
    );
  };
export const SkeletonFour = () => {
  return (
    <div className="bg-slate-950 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 w-full">
    <div className="flex gap-8 items-center">
      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
         
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">
          Find the perfect project partners and collaborate seamlessly. Our intelligent matching system connects you with fellow students who share your interests and skills.
        </p>

        <div className="flex gap-6 max-w-3xl">
          <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-lg">
            <Puzzle className="w-5 h-5 text-yellow-400 shrink-0" />
            <span className="text-gray-200 text-sm">Skill-based matching</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-lg">
            <MessageSquare className="w-5 h-5 text-yellow-400 shrink-0" />
            <span className="text-gray-200 text-sm">Real-time collaboration</span>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative w-[24rem] shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
          alt="Team Collaboration"
          className="rounded-lg shadow-lg w-full h-[12rem] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent rounded-lg"></div>
       
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
                alt="Team Member"
                className="w-8 h-8 rounded-full border-2 border-slate-950 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
                alt="Team Member"
                className="w-8 h-8 rounded-full border-2 border-slate-950 object-cover"
              />
              <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-yellow-400 flex items-center justify-center text-slate-950 text-xs font-medium">
                +5
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 transition-colors bg-slate-950/80 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-medium">Join Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
