
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {  Calendar } from "@/components/ui/calendar"
import { ChangeEvent, useState } from "react"
import { BACKEND_URL, projectCategories } from "@/constants"
import { Value } from "@radix-ui/react-select"
import { Delete, Trash } from "lucide-react"
import { formatDateToDDMMYYYY, parseDDMMYYYYToDate } from "@/utils/date"
import { toast } from "../ui/use-toast"
import axios, { AxiosError } from "axios"
import Cookies from "js-cookie"
import { UploadButton } from "@/utils/uploadthing"
import { useRouter } from "next/navigation"
import { ProjectFormData, TeamMember } from "@/types"
import { useForm } from 'react-hook-form';
// import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format } from "date-fns"

export function AddProjectForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProjectFormData>({
    projectTitle: '',
    projectDescription: '',
    projectCategory: '',
    tags: '',
    projectImage: null,
    problemStatement: '',


    technologiesUsed: '',
    status: '',
 
  
    projectURL: '',
    githubRepoLink: '',
    documentation: '',
    presentation: '',
    openForCollaboration: false,
    contactInformation: '',
    feedbackComments: '',
    startDate: new Date(),
    endDate: undefined,
    license: '',
    challengesFaced: '',
    futureScope: '',
    gallery: [],
    demoVideo: '',
    privacySettings: '',
    approvalStatus: '',
  });
  const [isHovered,setIsHovered] =  useState(false);
const [isLoading,setIsLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement|any>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const handleSubmit = async()=>{
  setIsLoading(true)
  console.log(formData)
  if(formData.projectCategory==''||formData.projectTitle==''||formData.projectDescription==''||formData.projectImage== null||formData.githubRepoLink==''||formData.contactInformation==''||formData.startDate==undefined
  ){
    toast({
      title:'Please fill all the fields',
      className:"bg-yellow-400"
    });
    setIsLoading(false);
    return;
  }
 
  let data:any = {}
  data.category = formData.projectCategory;
  data.title = formData.projectTitle;
  data.description = formData.projectDescription;
  data.banner = formData.projectImage;
  data.openForCollab = formData.openForCollaboration;
  data.start = formData.startDate;
  data.technologiesUsed = formData.technologiesUsed.replace(', ',',').replace(' ,',',');
  data.end = formData.endDate;
  data.currently_working = formData.endDate!=undefined||formData.status!="completed"
  data.tags = formData.tags.trim().replace(', ',',').replace(' ,',',');
  data.live = formData.projectURL;
  data.github_repos = formData
  .githubRepoLink;
  data.documentationLink = formData.documentation,
  data.demoLink = formData.demoVideo
  
  try{
    const res = await axios.post(`${BACKEND_URL}/projects/create`,data,{
      headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
      }
    });
    // const res_data = res.data;/
    router.push(`/account/projects/my-projects/view/${res.data.pid}`)
toast({
  title:"Project added successfully",
  className:"bg-green-500 "
})
  }
  catch(error){
const axiosError = error as AxiosError<any>;
if(axiosError.response?.data.message){
  toast({
    title:axiosError.response.data.message,
    variant:"destructive"
  })
 
} else{
  toast({
    title:"Some error occured",
    variant:"destructive"
  })
}
  }
  finally{
setIsLoading(false);
  }

}


  return (
    <div className="dark bg-background text-foreground">
      <Card className="w-full max-w-5xl mx-auto p-6 sm:p-8 md:p-10">
      <div onMouseEnter={()=>{
            setIsHovered(true)
        }} onMouseLeave={()=>{setIsHovered(false)}} className={`relative w-3/4 mx-auto rounded-md h-[200px] mb-4 flex items-center justify-center ${!formData.projectImage && 'bg-slate-900/50' }`} onClick={(e)=>{
          if(formData.projectImage){
            setFormData({...formData,projectImage:null});
          }
        }} >
 {formData.projectImage&&<img src={formData.projectImage} className='w-full h-full'/>}
            {isHovered && formData.projectImage && (
        <div className="absolute cursor-pointer inset-0 rounded-md flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity">
        <Trash size={40}/>
        </div>
            )}
            <UploadButton
       className={`${formData.projectImage&&'hidden'} mt-2`}
       
       endpoint="fileUploader"
       onClientUploadComplete={(res) => {
       setFormData({...formData,projectImage:res[0].url})
       }}
       onUploadError={(error: Error) => {
         // Do something with the error.
         alert(`ERROR! ${error.message}`);
       }}
     />
</div>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Project Details</CardTitle>
          <CardDescription>Fill out the form to provide comprehensive details about your project.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input onChange={handleChange} name="projectTitle" id="title" placeholder="Enter project title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea onChange={handleChange} name="projectDescription" id="description" rows={4} placeholder="Provide a detailed description of the project" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Project Category *</Label>
                <Select onValueChange={(e)=>{console.log(e);setFormData({...formData,projectCategory:e})}} >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                   {projectCategories.map((categ,index)=>{
                    return(
                      <SelectItem key={categ.id} value={categ.value}>{categ.label}</SelectItem>
                    )
                   }) 
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags/Keywords *</Label>
                <Input onChange={handleChange} name="tags" id="tags" placeholder="Enter tags separated by commas" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="problem-statement">Problem Statement</Label>
                <Textarea
                name="problemStatement"
                onChange={handleChange}
                  id="problem-statement"
                  rows={4}
                  placeholder="Describe the problem your project aims to solve"
                />
              </div>
            
              
              <div className="grid gap-2">
                <Label htmlFor="technologies">Technologies Used *</Label>
                <Input onChange={handleChange} name="technologiesUsed" id="technologies" placeholder="Enter the technologies used in the project" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select onValueChange={(e)=>setFormData({...formData,status:e})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            
            </div>
            <div className="flex flex-col gap-5 ">
              <div className="grid gap-2">
                <Label htmlFor="project-url">Project URL *</Label>
                <Input onChange={handleChange} name="projectUrl" id="project-url" placeholder="Enter project URL" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repository">GitHub/Repository Link *</Label>
                <Input onChange={handleChange} name="githubRepoLink" id="repository" placeholder="Enter repository link" />
              </div>
          
              <div className="grid gap-2">
                <Label htmlFor="collaboration">Open for Collaboration</Label>
                <Checkbox name="openForCollaboration" onChange={handleChange} id="collaboration" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Information *</Label>
                <Input onChange={handleChange} name="contactInformation"  id="contact" type="email" placeholder="Enter your email" />
              </div>
             
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal">
                        {formData.startDate!=undefined?format(formData.startDate,'dd/MM/yyyy'):'Pick a date '}
                        <div className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar selected={formData.startDate!=undefined?formData.startDate:undefined}  onSelect={(day)=>day&&setFormData({...formData,startDate:day})} mode="single" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal">
                      {formData.endDate!=undefined?format(formData.endDate,'dd/MM/YYYY'):'Pick a date '}
                        <div className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar selected={formData.endDate!=undefined?(formData.endDate):undefined} onSelect={(day)=>{day&&setFormData({...formData,endDate:day})}} mode="single" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
             
     
           
              <div className="grid gap-2">
                <Label htmlFor="demo-video">Demo Video</Label>
                <Input onChange={handleChange} name="demoVideo" id="demo-video" placeholder="Enter a link to the demo video" />
              </div>

             
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end">
            <Button disabled={isLoading} onClick={handleSubmit}>Save Project</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )

}
