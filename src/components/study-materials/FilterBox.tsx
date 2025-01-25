"use client";
import React, { useEffect, useRef, useState } from "react";
import ComboBox from "../ComboBox";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import {parseAsString, useQueryState} from "nuqs"
import { BACKEND_URL, branches, paperType, universities } from "@/constants";
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
  const [year, setYear] = useQueryState('year',parseAsString.withDefault('1'));
  const [selectedBranch, setSelectedBranch] = useQueryState('branch');

  const [subject, setSubject] = useQueryState('subject');
  const [selectedUniversity, setSelectedUniversity] = useQueryState('university')
  // const [selectedPaperType, setSelectedPaperType] = useQueryState('')
  const [selectedSession, setSelectedSession] = useQueryState('session');
const fetchSubjects = async()=>{
  var params = "";
  if (year) {
 
    params = params.concat("?year=").concat(year);
  }
  if (selectedBranch) {
    params = params.concat(`&branch=${selectedBranch}`);
  }
  
try {
   const res  = await axios.get(`${BACKEND_URL}/utils/subjects/${params}`);
   const data = res.data;
   subjectsState(data.subjects);
   res.data.subjects.unshift({
    value:'',label:'All',id:'All'
   })
 
 
   return res.data.subjects;
  
} catch (error) {
  toast({ title: "Error Occurred", variant: "destructive", color: "red" });
  return Promise.reject("Some error occured")
}
   

  
}
const {data:subjectsFilterOptions,isLoading:isSubjectsLoading} = useQuery<{value:string,label:string,id:string}[]>({
  queryKey:[year,selectedBranch],
  queryFn:fetchSubjects,
  refetchOnWindowFocus:false,
        retry:false
})
 

  const sessions = yearTillNow();

 

const fetchResources = async()=>{
  var params: any = {};
    if (year) {
      params.collegeYear = year;
    }
    if (parseInt(year)>1 && selectedBranch) {
      params.branch = selectedBranch;
    }
    else{
      params.branch = 'first-year';
    }
    if (selectedUniversity) {
      params.university = selectedUniversity;
    }
   
    if(subject){
      params.code = subject;
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

const {data:resourceData,isSuccess} = useQuery<any>(
  {
    queryKey:[year,selectedBranch,selectedSession,subject],
    queryFn:fetchResources,
    // refetchOnMount:false,
    refetchOnWindowFocus:false,
        retry:false
  }
)


 
  return (
    <div className=" md:flex md:flex-row md:justify-around gap-x-5 flex flex-col items-center justify-center  gap-5">
      {/* Year filter */}
      {filters.year && (
        <ComboBox
        defaultValue={year}
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
      {filters.subjects &&!isSubjectsLoading &&(
        <ComboBox
        defaultValue={subject}
          label="Select Subject"
          options={subjectsFilterOptions?subjectsFilterOptions:[{id:'all',value:'',label:'All'}]}
          stateSetter={setSubject}
        />
      )}
      {
     ( parseInt(year)>1) && <ComboBox label="Select Branch"
     defaultValue={selectedBranch}
      options={branches} stateSetter={setSelectedBranch}/>
      }
      {filters.university && (
        <ComboBox
        defaultValue={selectedUniversity}
          label="Select university"
          options={universities}
          stateSetter={setSelectedUniversity}
        />
      )}
      {/* <ComboBox label='Select university' options={paperType} stateSetter={setSelectedPaperType} /> */}
     
    </div>
  );
};

export default FilterBox;
