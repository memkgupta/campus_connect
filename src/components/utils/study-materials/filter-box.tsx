"use client";
import React, { useEffect, useRef, useState } from "react";
import ComboBox from "../../ui/combobox-custom";
import axios from "axios";
import { useToast } from "../../ui/use-toast";
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
  const [selectedBranch, setSelectedBranch] = useQueryState('branch',parseAsString.withDefault('all'));
  const [subject, setSubject] = useQueryState('subject',parseAsString.withDefault('all'));
  const [selectedUniversity, setSelectedUniversity] = useQueryState('university',parseAsString.withDefault('aktu'))
  // const [selectedPaperType, setSelectedPaperType] = useQueryState('')
  const [selectedSession, setSelectedSession] = useQueryState('session');
const fetchSubjects = async () => {
  const params: Record<string, string> = {};

  if (year) {
 
    params.year = String(year);
  }

  if (selectedBranch) {
    params.branch = String(selectedBranch);
  }

  try {
    const res = await axios.get(`${BACKEND_URL}/subjects`, { params });
    const data = res.data;

    // Add "All" as the first option
    const subjects = [
      { value: '', label: 'All', id: 'All' },
      ...data.subjects,
    ];

    subjectsState(subjects);
    return subjects;
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    toast({
      title: "Error Occurred",
      variant: "destructive",
      color: "red",
    });
    return Promise.reject("Some error occurred");
  }
};

const {data:subjectsFilterOptions,isLoading:isSubjectsLoading} = useQuery<{value:string,label:string,id:string}[]>({
  queryKey:[year,selectedBranch],
  queryFn:fetchSubjects,
  refetchOnWindowFocus:false,
        retry:false
})
 

  const sessions = yearTillNow();

 

const fetchResources = async () => {
  const params: Record<string, string> = {};

  if (year) {
    params.collegeYear = String(year);
  }

  if (parseInt(year) > 1 && selectedBranch) {
    params.branch = String(selectedBranch);
  } else {
    params.branch = 'first-year';
  }

  if (selectedUniversity) {
    params.university = String(selectedUniversity);
  }

  if (subject) {
    params.code = String(subject);
  }

  if (type) {
    params.type = String(type);
  }

  try {
    loading(true);
    console.log("Axios Params ➡️", params); // helpful for debugging
    const res = await axios.get(url, { params });
    state(res.data.resources);
    return res.data.resources;
  } catch (error: any) {
    console.error("❌ Axios error:", error);
    toast({
      title: "Some error occurred",
      variant: "destructive",
    });
    return Promise.reject("Some error occurred");
  } finally {
    loading(false);
  }
};

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
          stateSetter={(v:any)=>{setYear(v.value)}}
        />
      )}
      {/* Subject filter */}
      {filters.subjects &&!isSubjectsLoading &&(
        <ComboBox
        defaultValue={subject}
          label="Select Subject"
          options={subjectsFilterOptions&&subjectsFilterOptions.length>0?subjectsFilterOptions:[{id:'all',value:'all',label:'All'}]}
          stateSetter={(v:any)=>setSubject(v.value)}
        />
      )}
      {
     ( parseInt(year)>1) && <ComboBox label="Select Branch"
     defaultValue={selectedBranch}
      options={branches} stateSetter={(v:any)=>{setSelectedBranch(v.value)}}/>
      }
      {filters.university && (
        <ComboBox
        defaultValue={selectedUniversity}
          label="Select university"
          options={universities}
          stateSetter={(v:any)=>{setSelectedUniversity(v.value)}}
        />
      )}
      {/* <ComboBox label='Select university' options={paperType} stateSetter={setSelectedPaperType} /> */}
     
    </div>
  );
};

export default FilterBox;
