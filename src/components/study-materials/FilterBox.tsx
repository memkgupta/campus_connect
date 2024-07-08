'use client'
import React, { useEffect, useState } from 'react'
import ComboBox from '../ComboBox'
import axios from 'axios'
import { useToast } from '../ui/use-toast'
import { paperType, universities } from '@/constants'
import { yearTillNow } from '@/helpers/yearUtility'

const FilterBox = ({state,url,loading,subjectsState}:{state:any,url:string,loading:any,subjectsState?:any}) => {
type SubjectOptions = {
year:number,
label:string,
code:string,
branch:string
  }
  const {toast} = useToast();
  const [year,setYear] = useState({
    value:'1',label:"1st year",id:'1'
    })
    const [selectedBranch,setSelectedBranch] = useState<{value:string,label:string,id:string}|null>({value:'first-year',label:'First Year',id:'first-year'});
    // const [selectedBranch,setSelectedBranch] = useState({val})
  // const [subjectsOptions,setSubjectsOptions] = useState<SubjectOptions[]>([
  //   {
  //     year: 1,
  //     label: "Engineering Mathematics-I",
  //     code: "maths-1",
  //     branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Engineering Physics",
  //     code: "physics",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Engineering Chemistry",
  //     code: "chemistry",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Engineering Mechanics",
  //     code: "mechanics",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Programming for Problem Solving",
  //     code: "pps",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Soft Skills",
  //     code: "soft_skills",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Engineering Physics Lab",
  //     code: "physics lab",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Engineering Chemistry Lab",
  //     code: "chemistry lab",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Engineering Mechanics Lab",
  //     code: "mechanics lab",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Programming for Problem Solving Lab",
  //     code: "pps lab",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Workshop Practice",
  //     code: "workshop",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Engineering Mathematics-II",
  //     code: "maths-2",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Basic Electrical Engineering",
  //     code: "electrical",branch:'all'
  //   },
    
    
  //   {
  //     year: 1,
  //     label: "Basic Electronics Engineering",
  //     code: "electronics",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Engineering Graphics & Design",
  //     code: "graphics",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Environment & Ecology",
  //     code: "evs",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Basic Electrical Engineering Lab",
  //     code: "electrical lab",branch:'all'
  //   },
    
  //   {
  //     year: 1,
  //     label: "Basic Electronics Engineering Lab",
  //     code: "electronics lab",branch:'all'
  //   },
  //   {
  //     year: 1,
  //     label: "Soft Skills Lab",
  //     code: "soft_skills_lab",branch:'all'
  //   }
  // ]);
const[subjectsFilterOptions,setSubjectFilterOptions] = useState<{value:string,id:string,label:string}[]>([])
 // fetching subjects 
 useEffect(()=>{
  var params = ""
  if(year){
    console.log(year)
     params= params.concat("?year=").concat(year.value);
  }
  if(selectedBranch){
     params= params.concat(`&branch=${selectedBranch.value}`)
  }
const fetchSubjects = async()=>{
try {
const res = await axios.get(`/api/subjects${params}`);
const data = res.data;
if(data.success){
  setSubjectFilterOptions(data.subjects);
  subjectsState(data.subjects);
}
} catch (error) {
toast({title:'Error Occured',variant:'destructive',color:'red'})
}
}
fetchSubjects();
},[year,selectedBranch]);
const [subject,setSubject] = useState();

const sessions = yearTillNow();

const [selectedUniversity,setSelectedUniversity] = useState({label:'AKTU',value:'AKTU (UP)',id:'AKTU'});
const [selectedPaperType,setSelectedPaperType] = useState({value:'end-sem',label:'Semester exams',id:'end-sem'}) 
const[selectedSession,setSelectedSession] = useState(sessions[0]);

useEffect(()=>{
  var params:any = {}
  if(year){
    params.collegeYear = year.value
  }
  if(selectedBranch){
    params.branch = selectedBranch.value
  }
  if(selectedUniversity){
    params.university = selectedUniversity.value
  }
  if(selectedSession){
    params.sessionYear = selectedSession.value
  }
    const fetchData = async()=>{
try{
  loading(true);
  const res = await axios.get(url,{params:params});
  state(res.data.data)
}catch(error:any){
  toast({
    title:'Some error occured',
    variant:'destructive'
  })
}
finally{
  loading(false)
}

}
fetchData();
},[year,selectedBranch,selectedUniversity,subject,selectedPaperType,selectedSession])
return (
    <div className='hidden md:flex justify-around gap-x-5 '>
    

      {/* Year filter */}
      <ComboBox label='Select Year' options={[
         {
          value:'1',label:"1st year",id:'1'
          },
          {
            value:'2',label:"2nd year",id:'2'
          },
          {
            value:'3',label:"3rd year",id:'3'
          },
          {
            value:'4',label:"4th year",id:'4'
          }
      ]} stateSetter={setYear}/>
      {/* Subject filter */}
      <ComboBox label='Select Subject' options={subjectsFilterOptions} stateSetter={setSubject}/>
      <ComboBox label='Select university' options={universities} stateSetter={setSelectedUniversity}/>
      {/* <ComboBox label='Select university' options={paperType} stateSetter={setSelectedPaperType} /> */}
      <ComboBox label='Select session' options={sessions} stateSetter={setSelectedSession}/>
    </div>
  )
}

export default FilterBox