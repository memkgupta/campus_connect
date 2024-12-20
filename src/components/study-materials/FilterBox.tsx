"use client";
import React, { useEffect, useRef, useState } from "react";
import ComboBox from "../ComboBox";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { BACKEND_URL, paperType, universities } from "@/constants";
import { yearTillNow } from "@/helpers/yearUtility";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
interface Params {
  collegeYear?: string;
  branch?: string;
  university?: string;
  sessionYear?: string;
}
const FilterBox = ({
  state,
  url,
  type,
  loading,
  subjectsState,
  filters = {
    year: true,
    branch: true,
    subjects: true,
    source:false,
    paperType: false,
    session: true,
    university: true,
  },
}: {
  state: any;
  url: string;
  type:string,
  loading: any;
  subjectsState?: any;
  filters?: {
    year?: boolean;
    subjects?: boolean;
    branch?: boolean;
    session?: boolean;
    source?:boolean;
    paperType?: boolean;
    university?: boolean;
  };
}) => {
  type SubjectOptions = {
    year: number;
    label: string;
    code: string;
    branch: string;
  };
  const { toast } = useToast();
  const [year, setYear] = useState({
    value: "1",
    label: "1st year",
    id: "1",
  });
  const [selectedBranch, setSelectedBranch] = useState<{
    value: string;
    label: string;
    id: string;
  } | null>({ value: "first-year", label: "First Year", id: "first-year" });



  // fetching subjects
const fetchSubjects = async()=>{
  var params = "";
  if (year) {
  
    params = params.concat("?year=").concat(year.value);
  }
  if (selectedBranch) {
    params = params.concat(`&branch=${selectedBranch.value}`);
  }
  
try {
   const res  = await axios.get(`${BACKEND_URL}/utils/subjects/${params}`);
   const data = res.data;
   subjectsState(data.subjects);
   return res.data.subjects;
  
} catch (error) {
  toast({ title: "Error Occurred", variant: "destructive", color: "red" });
  return Promise.reject("Some error occured")
}
   

  
}
const {data:subjectsFilterOptions} = useQuery<{value:string,label:string,id:string}[]>({
  queryKey:[year,selectedBranch],
  queryFn:fetchSubjects,
  refetchOnWindowFocus:false,
        retry:false
})
  const [subject, setSubject] = useState<{value:string,label:string,id:string}>();

  const sessions = yearTillNow();

  const [selectedUniversity, setSelectedUniversity] = useState({
    label: "AKTU",
    value: "AKTU",
    id: "AKTU",
  });
  const [selectedPaperType, setSelectedPaperType] = useState({
    value: "end-sem",
    label: "Semester exams",
    id: "end-sem",
  });
  const [selectedSession, setSelectedSession] = useState(sessions[0]);

const fetchResources = async()=>{
  var params: any = {};
    if (year) {
      params.collegeYear = year.value;
    }
    if (selectedBranch) {
      params.branch = selectedBranch.value;
    }
    if (selectedUniversity) {
      params.university = selectedUniversity.value;
    }
    if (selectedSession) {
      params.sessionYear = selectedSession.value;
    }
    if(subject){
      params.subject = subject.value;
    }
    if(selectedPaperType){
      params.paperType = selectedPaperType.value
    }
    if(type){
      console.log(type)
      params.type = type;
    }
    try {
      loading(true);
      const res = await axios.get(url, { params: params });
      state(res.data.resources)
      return res.data.resources;
    } catch (error: any) {
      console.log(error)
      toast({
        title: "Some error occured",
        variant: "destructive",
      });
      return Promise.reject("Some error occured")
    } finally {
      loading(false);
    }
}
// const fetchSources = async
const {data:resourceData,isSuccess} = useQuery<any>(
  {
    queryKey:[year,selectedBranch,selectedSession,subject],
    queryFn:fetchResources,
    // refetchOnMount:false,
    refetchOnWindowFocus:false,
        retry:false
  }
)
// const {data:sources,isFetching} = useQuery<any>({
//   queryKey:['sources'],
//   queryFn:
// })

 
  return (
    <div className=" md:flex md:flex-row md:justify-around gap-x-5 flex flex-col items-center justify-center  gap-5">
      {/* Year filter */}
      {filters.year && (
        <ComboBox
          label="Select Year"
          options={[
            {
              value: "1",
              label: "1st year",
              id: "1",
            },
            {
              value: "2",
              label: "2nd year",
              id: "2",
            },
            {
              value: "3",
              label: "3rd year",
              id: "3",
            },
            {
              value: "4",
              label: "4th year",
              id: "4",
            },
          ]}
          stateSetter={setYear}
        />
      )}
      {/* Subject filter */}
      {filters.subjects && (
        <ComboBox
          label="Select Subject"
          options={subjectsFilterOptions?subjectsFilterOptions:[]}
          stateSetter={setSubject}
        />
      )}
      {filters.university && (
        <ComboBox
          label="Select university"
          options={universities}
          stateSetter={setSelectedUniversity}
        />
      )}
      {/* <ComboBox label='Select university' options={paperType} stateSetter={setSelectedPaperType} /> */}
      {filters.session && (
        <ComboBox
          label="Select session"
          options={sessions}
          stateSetter={setSelectedSession}
        />
      )}
    </div>
  );
};

export default FilterBox;
