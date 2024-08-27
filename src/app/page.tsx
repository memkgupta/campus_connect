"use client"
import Image from "next/image";
import Link from "next/link";
import { Bug, GithubIcon, LinkedinIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

export default function Home() {
  const about = [
    {
      id: 1,
      heading: "Resources",
      description:
        "Find all the academic resources you need in one place. Our platform offers access to study guides, lecture notes, textbooks, and interactive tools to support your learning journey. Whether for exam prep or daily study, we’ve got everything to help you succeed",
      image: "/resources.png",
    },
    {
      id: 2,
      heading: "Events",
      description:
        "Stay informed about all campus events with ease. Our platform keeps you updated on upcoming seminars, workshops, social gatherings, and more. From major events to small activities, find everything you need to stay connected and engaged with campus life.",
      image: "/events.png",
    },
    {
      id: 3,
      heading: "Projects",
      description:
        "Explore and collaborate on a variety of projects with fellow students. Our platform connects you with project ideas, team opportunities, and resources to bring your academic and extracurricular projects to life. Find the perfect project to enhance your skills and work together with peers.",
      image: "/projects.png",
    },
  ];
const [isLoading,setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  useEffect(()=>{
if(session?.user){
  setIsLoading(false);
}
if(status==="unauthenticated"){
  setIsLoading(false);
}
  },[status,session])
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="bg-red-500 w-full">
            <p className="animate-marquee">
              This project is currently in beta version and it may (will 🫠)
              contain bugs.
            </p>
          </div>
          <section
            className={"md:flex justify-center items-center px-12 py-10"}
          >
            <div className={"hero-img"}>
              <Image
                width={500}
                height={500}
                alt={"hero-image"}
                src={"/hero.svg"}
                className={"w-[500px] h-[400px]"}
              />
            </div>
            <div className={"flex-col items-center justify-center"}>
              <h1 className={"md:text-7xl text-center text-4xl font-bold mb-4"}>
                Campus Connect
              </h1>
              <p className={"text-center  text-xl"}>
                "Discover, Connect, and Collaborate with Fellow Students"
              </p>
              <div className={"flex justify-center"}>
                <p
                  className={
                    "w-[300px] text-sm text-yellow-300 antialiased italic text-center mt-4"
                  }
                >
                  Your One-Stop place for all your academic resources and
                  projects ideas and collaboration
                </p>
              </div>
              <div className={"flex justify-center gap-2 mt-4"}>
                <Link
                  href={"https://github.com/memkgupta/campus_connect"}
                  className={
                    "flex gap-2 mt-2 bg-amber-300 border border-yellow-400 p-2 rounded-full w-fit text-black hover:bg-yellow-100"
                  }
                >
                  <GithubIcon />
                  Star our repo
                </Link>
                <Link
                  target={"_blank"}
                  href={
                    "https://docs.google.com/forms/d/e/1FAIpQLSdiumf-CgOqwSmuHEk06CFOoAG5OXxfMTml824hLsqRgxbyfg/viewform?usp=sf_link"
                  }
                  className={
                    "flex gap-2 mt-2 bg-red-500 border border-yellow-400 p-2 rounded-full w-fit  hover:bg-red-300"
                  }
                >
                  <Bug />
                  Report a bug
                </Link>
              </div>
            </div>
          </section>

          {/*  About  */}
          <div className={"flex-col px-12 items-center justify-center"}>
            <p className={"text-center font-bold text-3xl mb-4"}>About</p>
            <p
              className={`text-center mx-auto md:px-24 px-10 text-yellow-200 text-sm antialiased `}
            >
              This platform is created for connecting students of our college
              with the aim of promoting collaboration and connecting students
              with each other. This platform provides you all the ongoing events
              details and clubs and communities can also register themselves and
              can share their events. And Moreover you can share your projects
              here and can also open them for collaboration. And last but not
              least this is an open source so if you want any feature and find
              any bug you can contribute to it and get featured on this website.
            </p>
          </div>
          <section className={"md:px-24 px-10 mt-24"}>
            {about.map((item) => (
              <div key={item.id} className={`md:flex gap-3 items-center`}>
                <Image
                  src={item.image}
                  alt={item.image}
                  className={"py-3 mx-auto"}
                  width={300}
                  height={300}
                />
                <div className={"px-12"}>
                  <p className={"mb-5 font-bold text-4xl"}>{item.heading}</p>
                  <p className={"text-justify"}>{item.description}</p>
                </div>
              </div>
            ))}
          </section>
          <section
            className={
              "mt-2 md:px-24 px-12 flex flex-col justify-center items-center"
            }
          >
            <p className={"text-center font-bold text-4xl my-4"}>Open Source</p>
            <p className={"text-center"}>
              This project is an effort to cultivate an open-source mindset
              within our community. By contributing your ideas, adding new
              features, and fixing bugs, you have the opportunity to directly
              shape and improve this platform. We encourage everyone to
              participate, learn, and grow together, making this platform better
              for all. Your involvement not only enhances your skills but also
              fosters a collaborative environment where we all benefit from
              shared knowledge and creativity. Let's work together to build
              something truly impactful.
            </p>
            <Link
              href={"https://github.com/memkgupta/campus_connect"}
              className={
                "flex gap-2 mt-2 bg-amber-300 border border-yellow-400 p-2 rounded-full w-fit text-black hover:bg-yellow-100"
              }
            >
              <GithubIcon />
              Star our repo
            </Link>
          </section>
          <footer
            className={
              "mt-3 flex flex-col items-center justify-center  bottom-0 w-full h-20 bg-slate-900"
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
