import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BACKEND_URL } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BookOpen, Calendar, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"

export default function Component({tracker}:{tracker:any}) {
  // This would typically come from props or a data fetch
  const [progress,setProgress] = useState<any>({})
  const fetchProgress = async()=>{
    try {
        if(tracker!=null){
            const res = await axios.get(`${BACKEND_URL}/tracker/progress?tid=${tracker._id}`)
            if(res.data.success){
                setProgress(res.data.data)
                return res.data.data;
            }
        }
     
    } catch (error:any) {
        return new Error(error.message)
    }
  }
  const _d = useQuery({
    queryKey:[tracker],
    queryFn:fetchProgress,
    staleTime:Infinity,
    retry:false,
    refetchOnWindowFocus:false
  })

  return (
    <div className="w-full  bg-slate-950 text-slate-100 p-4">
 { progress &&    <div className="max-w-4xl mx-auto space-y-6">
       
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-100">Course Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div 
              className="radial-progress text-primary" 
              style={{"--value": progress.progress, "--size": "12rem", "--thickness": "2rem"} as React.CSSProperties}
            >
              {Math.ceil(progress.progress*100)/100}%
            </div>
            <div className="w-full max-w-md space-y-2">
              <Progress value={progress.progress} className="h-2" />
              <p className="text-sm text-slate-400 text-center">{Math.ceil(progress.progress*100)/100}% Complete</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-100">Lectures Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{progress.lecturesCompleted}/{progress.totalLectures}</div>
              <p className="text-xs text-slate-400">modules</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-100">Lectures Remaining</CardTitle>
              <BookOpen className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{progress.totalLectures - progress.lecturesCompleted}</div>
              <p className="text-xs text-slate-400">lectures left</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-100">Estimated Time to Complete</CardTitle>
              <Calendar className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{progress.estimatedDays}</div>
              <p className="text-xs text-slate-400">days remaining</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-100">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{progress.hoursSpent}</div>
              <p className="text-xs text-slate-400">hours</p>
            </CardContent>
          </Card>
        </div>
      </div>}
    </div>
  )
}