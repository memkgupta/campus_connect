"use client";
import React, { useEffect, useRef, useState } from "react";
import ComboBox from "../ComboBox";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { paperType, universities } from "@/constants";
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
  loading,
  subjectsState,
  filters = {
    year: true,
    branch: true,
    subjects: true,
    paperType: false,
    session: true,
    university: true,
  },
}: {
  state: any;
  url: string;
  loading: any;
  subjectsState?: any;
  filters?: {
    year?: boolean;
    subjects?: boolean;
    branch?: boolean;
    session?: boolean;
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
    console.log(year);
    params = params.concat("?year=").concat(year.value);
  }
  if (selectedBranch) {
    params = params.concat(`&branch=${selectedBranch.value}`);
  }
try {
   const res  = await axios.get(`/api/subjects/${params}`);
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
  queryFn:fetchSubjects
})
  const [subject, setSubject] = useState();

  const sessions = yearTillNow();

  const [selectedUniversity, setSelectedUniversity] = useState({
    label: "AKTU",
    value: "AKTU (UP)",
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
    try {
      loading(true);
      const res = await axios.get(url, { params: params });
      return res.data.data;
    } catch (error: any) {
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
    queryKey:[year,selectedBranch,selectedUniversity,selectedSession],
    queryFn:fetchResources,
    // refetchOnMount:false,
    refetchOnWindowFocus:false
  }
)

useEffect(()=>{
  if(isSuccess){
    state(resourceData);
  }
},[resourceData])
  // const cache = useRef<{ [key: string]: any }>({}); 
  // const [params, setParams] = useState<Params>({});

  // // Create a unique key based on the parameters
  // const createCacheKey = (params: Params) => {
  //   return JSON.stringify(params);
  // };

  // Update params when inputs change
  // useEffect(() => {
  //   const newParams: Params = {};
  //   if (year) newParams.collegeYear = year.value;
  //   if (selectedBranch) newParams.branch = selectedBranch.value;
  //   if (selectedUniversity) newParams.university = selectedUniversity.value;
  //   if (selectedSession) newParams.sessionYear = selectedSession.value;
  //   setParams(newParams);
  // }, [year, selectedBranch, selectedUniversity, selectedSession]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const cacheKey = createCacheKey(params);

  //     if (cache.current[cacheKey]) {
  //       state(cache.current[cacheKey]);
  //       return;
  //     }

  //     try {
  //       loading(true);
  //       const res = await axios.get(url, { params });
  //       cache.current[cacheKey] = res.data.data;
  //       state(res.data.data);
  //     } catch (error) {
  //       toast({
  //         title: 'Some error occurred',
  //         variant: 'destructive',
  //       });
  //     } finally {
  //       loading(false);
  //     }
  //   };

  //   if (Object.keys(params).length > 0) {
  //     const debounceFetchData = setTimeout(fetchData, 500); // Debounce the API call
  //     return () => clearTimeout(debounceFetchData); // Cleanup the timeout on component unmount or params change
  //   }
  // }, [params, url, state, loading, toast]);
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
