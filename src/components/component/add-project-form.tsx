
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
import { projectCategories } from "@/constants"
import { Value } from "@radix-ui/react-select"
import { Delete, Trash } from "lucide-react"
import { formatDateToDDMMYYYY, parseDDMMYYYYToDate } from "@/utils/date"
import { toast } from "../ui/use-toast"
import axios, { AxiosError } from "axios"
import { UploadButton } from "@/utils/uploadthing"
import { useRouter } from "next/navigation"
import { ProjectFormData, TeamMember } from "@/types"



export function AddProjectForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProjectFormData>({
    projectTitle: '',
    projectDescription: '',
    projectCategory: '',
    tags: '',
    projectImage: null,
    problemStatement: '',
    objectives: '',
    features: '',
    technologiesUsed: '',
    status: '',
    teamMembers: [],
    projectLead: '',
    projectURL: '',
    githubRepoLink: '',
    documentation: '',
    presentation: '',
    openForCollaboration: false,
    contactInformation: '',
    feedbackComments: '',
    startDate: '',
    endDate: '',
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
 const handleTeamMemberChange = (value: string, index: number, name: string)=> {
    let member = formData.teamMembers[index];
    member = {...member,[name]:value};
    console.log(member)
    let members = formData.teamMembers
    members[index] = member
    setFormData({...formData,teamMembers:members});
  }
  const handleAddTeamMember = ()=>{
    let member:TeamMember = {username:'',linkedin:'',name:'',role:''}
    let members = formData.teamMembers
   
    members = [...members,member];
    setFormData({...formData,teamMembers:members});
  }
  const handleDeleteTeamMember = (index:number)=>{
    let members = formData.teamMembers;
   members = members.filter((v,i)=>i!=index);
   setFormData({...formData,teamMembers:members});
  }
const handleSubmit = async()=>{
  setIsLoading(true)
  if(formData.projectTitle==''||formData.projectDescription==''||formData.projectImage== null||formData.githubRepoLink==''||formData.contactInformation==''||formData.startDate==''
  ){
    toast({
      title:'Please fill all the fields',
      className:"bg-yellow-400"
    });
    return;
  }
  if(formData.teamMembers.some(member=>(member.role==""||member.username==''||member.name==''))){
    toast({
      title:'Please fill all the fields of team members',
      className:"bg-yellow-400"
    });
    return;
  }
  let data:any = {}
  data.category = formData.projectCategory;
  data.title = formData.projectTitle;
  data.description = formData.projectDescription;
  data.banner = formData.projectImage;
  data.openForCollab = formData.openForCollaboration;
  data.start = formData.startDate;
  data.end = formData.endDate;
  data.currently_working = formData.endDate!=''||formData.status!="completed"
  data.tags = formData.tags.trim().replace(' ','').split(',');
  data.live = formData.projectURL;
  data.github_repos = formData
  .githubRepoLink;
  data.contributors = formData.teamMembers;
  data.lead = formData.projectLead;
  data.documentationLink = formData.documentation,
  data.demoLink = formData.demoVideo
  
  try{
    const res = await axios.post(`/api/projects/create`,data);
    const res_data = res.data;
    router.push(`/projects/view/${res.data.id}`)
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
                <Select onValueChange={(e)=>setFormData({...formData,projectCategory:e})} >
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
                <Label htmlFor="objectives">Objectives</Label>
                <Textarea onChange={handleChange} name="objectives" id="objectives" rows={4} placeholder="Outline the key objectives of the project" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="features">Features</Label>
                <Textarea onChange={handleChange} name="features" id="features" rows={4} placeholder="List the main features of the project" />
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
              <div className="grid gap-2">
                <Label htmlFor="team-members">Team Members *</Label>
                <Card className="p-3 grid grid-cols-2 gap-3">
                  {
                    formData.teamMembers.map((member,index)=>(
                      <div className="flex flex-col gap-2" key={index}>
                        <Label>Name *</Label>
                    
                        <Input onChange={(e)=>{handleTeamMemberChange(e.target.value,index,"name")}} placeholder="Name of team member"/>
                        
                        
                        <Label>Username *</Label>
                        <Input onChange={(e)=>{handleTeamMemberChange(e.target.value,index,"username",)}} placeholder="Username of member"/>
                        <Label>Role *</Label>
                        <Input onChange={(e)=>{handleTeamMemberChange(e.target.value,index,"role",)}} placeholder="Role of member"/>
                        <Label>Linkedin</Label>
                        <Input onChange={(e)=>{handleTeamMemberChange(e.target.value,index,"linkedin",)}} placeholder="Linkedin profile of member"/>
                        <Button className="bg-red-500 text-white" onClick={(e)=>{
                          handleDeleteTeamMember(index)
                        }}><Trash/></Button>
                      </div>
                    ))
                  }

                </Card>
                <Button className="mt-2 w-fit px-2 justify-self-center" onClick={handleAddTeamMember}>Add</Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-lead">Project Lead *</Label>
                <Select onValueChange={(e)=>{setFormData({...formData,projectLead:e})}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project lead" />
                  </SelectTrigger>
                  <SelectContent>
                   {
                   formData.teamMembers.map((member)=>{
                    if(member.name!=""&&member.username!=""){
                      return (
                        <SelectItem value={member.username}>{member.name}</SelectItem>
                      )
                    }
                   })
                   /* { <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="bob-johnson">Bob Johnson</SelectItem>} */}
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
              {/* <div className="grid gap-2">
                <Label htmlFor="documentation">Documentation</Label>
                <Input name="" id="documentation" type="file" />
              </div> */}
              {/* <div className="grid gap-2">
                <Label htmlFor="presentation">Presentation/Slide Deck</Label>
                <Input id="presentation" type="file" />
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="collaboration">Open for Collaboration</Label>
                <Checkbox name="openForCollaboration" onChange={handleChange} id="collaboration" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Information *</Label>
                <Input onChange={handleChange} name="contactInformation"  id="contact" type="email" placeholder="Enter your email" />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="feedback">Feedback/Comments</Label>
                <Textarea id="feedback" rows={4} placeholder="Share your feedback or comments" />
              </div> */}
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal">
                        {formData.startDate!=''?formData.startDate:'Pick a date '}
                        <div className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar selected={formData.startDate!=''?parseDDMMYYYYToDate(formData.startDate):undefined}  onSelect={(day)=>day&&setFormData({...formData,startDate:formatDateToDDMMYYYY(day)})} mode="single" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal">
                      {formData.endDate!=''?formData.endDate:'Pick a date '}
                        <div className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar selected={formData.endDate!=''?parseDDMMYYYYToDate(formData.endDate):undefined} onSelect={(day)=>{day&&setFormData({...formData,endDate:formatDateToDDMMYYYY(day)}); console.log(day)}} mode="single" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
             
              {/* <div className="grid gap-2">
                <Label htmlFor="challenges">Challenges Faced</Label>
                <Textarea id="challenges" rows={4} placeholder="Describe the challenges faced during the project" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="future-scope">Future Scope</Label>
                <Textarea id="future-scope" rows={4} placeholder="Outline the future plans and scope for the project" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gallery">Gallery</Label>
                <Input id="gallery" type="file" multiple />
              </div> */}
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
