"use client"
import { BACKEND_URL } from "@/constants";
import axios from "axios";
import { ArrowRight, Code2, GitFork, Github, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

interface RepoData {
  stars: number;
  forks: number;
  linesOfCode: number;
  contributors: Contributor[];
}
const AnimatedCounter = ({ end, duration = 2000 }:any) => {
    const [count, setCount] = useState(0);
   
    useEffect(() => {

      let startTimestamp:any = null;
      const step = (timestamp:any) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    }, [end, duration]);
  
    return <>{count.toLocaleString()}</>;
  };

export const OpenSource = ()=>{

  const [repoData,setRepoData] = useState<RepoData|null>(null);
  useEffect(()=>{
    axios.get(`${BACKEND_URL}/utils/repo-stats`).then((data:any)=>{
      // console.log(data)
      setRepoData(data.data);
    })
    .catch((err)=>{
  
  
    })
  },[])
    return(
        <div className="bg-slate-950 rounded-xl p-6 px-24 shadow-xl hover:shadow-2xl transition-all duration-300 ">
<div className="">
  {/* Content */}

    

  


{repoData&&    <div className="flex flex-col md:flex-row gap-8 justify-between items-center px-12">

  <div className="flex gap-6 mb-4 px-12">
      <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg group hover:bg-slate-900 transition-colors">
        <Star className="w-5 h-5 md:w-10 md:h-10 text-yellow-200 " />
        <div>
          <div className="text-gray-200 text-xs md:text-lg font-semibold">
            <AnimatedCounter end={repoData.stars} />
          </div>
          <div className="text-gray-400 text-lg">Stars</div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg group hover:bg-slate-900 transition-colors">
        <GitFork className="w-5 h-5 md:w-10 md:h-10 text-yellow-200 " />
        <div>
          <div className="text-gray-200 text-xs md:text-lg font-semibold">
            <AnimatedCounter end={repoData.forks} />
          </div>
          <div className="text-gray-400 text-xs md:text-lg">Forks</div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg group hover:bg-slate-900 transition-colors">
        <Code2 className="w-5 h-5 md:w-10 md:h-10 text-yellow-200 " />
        <div>
          {/* <div className="text-gray-200 text-xs md:text-lg font-semibold">
            <AnimatedCounter end={repoData.linesOfCode} />
          </div>
          <div className="text-gray-400 text-xs md:text-lg">Lines of Code</div> */}
        </div>
      </div>
    </div>
  


  <div className="w-[24rem] shrink-0 bg-slate-900/50 rounded-lg p-4 px-12">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-yellow-200" />
        <h3 className="text-sm font-semibold text-gray-200">Top Contributors</h3>
      </div>
      <span className="text-xs text-gray-400">Last 30 days</span>
    </div>
    
    <div className="space-y-3">
      {repoData?.contributors?.map((contributor, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <img 
              src={contributor.avatar_url}
              alt={contributor.login}
              className="w-8 h-8 rounded-full border-2 border-yellow-400/20 group-hover:border-yellow-400 transition-colors"
            />
            <div>
              <div className="text-sm font-medium text-gray-200">{contributor.login}</div>
              <div className="text-xs text-gray-400">{contributor.html_url}</div>
            </div>
          </div>
          <div className="text-xs font-medium text-yellow-200">
            <AnimatedCounter end={contributor.contributions} duration={1500} /> commits
          </div>
        </div>
      ))}
    </div>

    <button className="w-full mt-3 flex items-center justify-center gap-1.5 text-yellow-200 hover:text-yellow-100 transition-colors bg-slate-900 px-3 py-2 rounded-lg group">
      <span className="text-xs font-medium">View All Contributors</span>
      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
</div>}
</div>

</div>
    )
}
