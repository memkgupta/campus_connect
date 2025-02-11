import { ArrowRight, Code2, GitFork, Github, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
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
    return(
        <div className="bg-slate-950 rounded-xl p-6 px-24 shadow-xl hover:shadow-2xl transition-all duration-300 w-full">
<div className="flex gap-8 justify-between items-center">
  {/* Content */}
  <div className="">
    

  

    {/* GitHub Stats */}
    <div className="flex gap-6 mb-4">
      <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg group hover:bg-slate-900 transition-colors">
        <Star className="w-10 h-10 text-yellow-200 " />
        <div>
          <div className="text-gray-200 text-lg font-semibold">
            <AnimatedCounter end={1200} />
          </div>
          <div className="text-gray-400 text-lg">Stars</div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg group hover:bg-slate-900 transition-colors">
        <GitFork className="w-10 h-10 text-yellow-200 " />
        <div>
          <div className="text-gray-200 text-lg font-semibold">
            <AnimatedCounter end={280} />
          </div>
          <div className="text-gray-400 text-lg">Forks</div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg group hover:bg-slate-900 transition-colors">
        <Code2 className="w-10 h-10 text-yellow-200 " />
        <div>
          <div className="text-gray-200 text-lg font-semibold">
            <AnimatedCounter end={15000} />
          </div>
          <div className="text-gray-400 text-lg">Lines of Code</div>
        </div>
      </div>
    </div>
  </div>

  {/* Contributors Section */}
  <div className="w-[24rem] shrink-0 bg-slate-900/50 rounded-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-yellow-200" />
        <h3 className="text-sm font-semibold text-gray-200">Top Contributors</h3>
      </div>
      <span className="text-xs text-gray-400">Last 30 days</span>
    </div>
    
    <div className="space-y-3">
      {[
        {
          name: "Sarah Chen",
          commits: 47,
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
          role: "Core Maintainer"
        },
        {
          name: "Alex Kumar",
          commits: 32,
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
          role: "Feature Developer"
        },
        {
          name: "Maria Garcia",
          commits: 28,
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
          role: "Bug Hunter"
        }
      ].map((contributor, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <img 
              src={contributor.avatar}
              alt={contributor.name}
              className="w-8 h-8 rounded-full border-2 border-yellow-400/20 group-hover:border-yellow-400 transition-colors"
            />
            <div>
              <div className="text-sm font-medium text-gray-200">{contributor.name}</div>
              <div className="text-xs text-gray-400">{contributor.role}</div>
            </div>
          </div>
          <div className="text-xs font-medium text-yellow-200">
            <AnimatedCounter end={contributor.commits} duration={1500} /> commits
          </div>
        </div>
      ))}
    </div>

    <button className="w-full mt-3 flex items-center justify-center gap-1.5 text-yellow-200 hover:text-yellow-100 transition-colors bg-slate-900 px-3 py-2 rounded-lg group">
      <span className="text-xs font-medium">View All Contributors</span>
      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
</div>
</div>
    )
}
