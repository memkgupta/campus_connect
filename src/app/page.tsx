"use client"
import Image from "next/image";
import Link from "next/link";
import { Bug, GithubIcon, LinkedinIcon } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useContext, useEffect, useState } from "react";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { FeaturesSectionDemo } from "@/components/ui/features";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Spotlight } from "@/components/ui/spotlight";
import { OpenSource } from "@/components/ui/open-source";

export default function Home() {
  const router = useRouter()

 
const [isLoading,setIsLoading] = useState(true);
  const session = useSession();
  useEffect(()=>{
if(session?.user){
  setIsLoading(false);
  router.replace("/home");  
}
else{
  setIsLoading(false)
}
  },[session])
  useEffect(()=>{

  },[])
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
        <section className="min-h-screen">
        <BackgroundBeamsWithCollision className="min-h-screen">
       
        
       <div className={"flex-col items-center justify-center"}>
         <h1 className={"text-3xl relative z-20 md:text-5xl lg:text-8xl font-bold text-center text-white font-sans tracking-tight"}>
           Campus Connect
         </h1>
         <div className="text-xl md:text-xl text-yellow-400 text-center lg:text-4xl  font-bold py-4  [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span className="">Collaborate, innovate, and grow</span>
          </div>
          <div className="">
   <InfiniteMovingCards
   className="mt-12"
        items={testimonials}
        direction="right"
        speed="slow"
      />
          </div>
       
       </div>
   
       </BackgroundBeamsWithCollision>
        </section>
     
          <FeaturesSectionDemo/>

      <div className="relative">
     <Spotlight/>
    <div className="h-screen w-full rounded-md bg-slate-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-2xl md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
        Campus Connect is Open Source – Join & Contribute!
        </h1>
        
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-lg mt-5 text-center relative z-10">
        Campus Connect is an open-source project built to empower students through collaboration and shared knowledge. Join us on this journey—contribute your ideas, code, and innovations to make it even better!
        </p>
        <div className="flex justify-center">
        <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        Star Repo
      </button>
        </div>
      
      </div>
      <OpenSource/>
    </div>
 
      </div>

        
          <footer
            className={
              "mt-3 flex flex-col items-center justify-center  bottom-0 w-full h-20 bg-slate-950"
            }
          >
            <p className={"mt-1"}>
              Made by ~{" "}
              <Link href={"https://bento.me/mkgupta"}>Mayank Gupta</Link>
            </p>
            <div className={"flex gap-2 mt-2 "}>
              <Link href={"https://github.com/memkgupta"}>
                <GithubIcon />
              </Link>
              <Link href={"https://www.linkedin.com/in/mayankgupta2005/"}>
                <LinkedinIcon />
              </Link>
            </div>
          </footer>
        </>
      )}
    </>
  );
}
const testimonials:any = [
  {
    quote:
      "Campus Connect is a good project and is problem solving. From finding team members for hackathons to staying updated with events, everything is now seamless!",
    name: "Priyanshu Pal",
    title: "CSE",
  },
  {
    quote:
      "Campus Connect is a good project and is problem solving. From finding team members for hackathons to staying updated with events, everything is now seamless!",
    name: "Nikhil Soni",
    title: "CSE",
  },
  {
    quote:
      "Before Campus Connect, it was tough to discover project collaborations. Now, I can easily connect with peers who share my interests and work on real-world applications.",
    name: "Mantosh",
    title: "CSE",
  },
  {
    quote:
      "Our college clubs struggled with event promotions. With Campus Connect, we saw a huge increase in participation and engagement. It's a must-have for any campus!",
    name: "Rudraksh Kushwaha",
    title: "GDSC Lead",
  },
  {
    quote:
      "I always wanted a platform where students from different branches could collaborate easily. Campus Connect makes it effortless to share knowledge and work on interdisciplinary projects.",
    name: "Mayank Rana",
    title: "CSE",
  },
 
]