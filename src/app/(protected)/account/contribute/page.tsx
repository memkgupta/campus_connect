"use client";
import React, { useContext, useEffect, useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { ContributorContext } from "@/context/ContributorContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileText, Loader2 } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import ComboBox from "@/components/ComboBox";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { yearTillNow } from "@/helpers/yearUtility";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";
import { branches, resourceTypes, universities } from "@/constants";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/utils/FileUpload";
const Page = () => {
  const date = new Date();
  const isContributor = useContext(ContributorContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [year, setYear] = useState({
    value: "1",
    label: "1st year",
    id: "1",
  });
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [sessionYear, setSessionYear] = useState({
    value: (date.getFullYear() - 1).toString(),
    label: (date.getFullYear() - 1).toString(),
    id: (date.getFullYear() - 1).toString(),
  });
  const [selectedSubject, setSelectedSubject] = useState<{
    value: string;
    label: string;
    id: string;
  } | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<{
    value: string;
    label: string;
    id: string;
  } | null>({ value: "first-year", label: "First Year", id: "first-year" });
  const [resourceType, setResourceType] = useState<{
    value: string;
    label: string;
    id: string;
  } | null>();

  const [subjects, setSubjects] = useState([]);
  const [label, setLabel] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState({
    value: "AKTU",
    label: "AKTU",
    id: "AKTU",
  });

  const handleSubmit = async () => {
    if (
      selectedBranch &&
      selectedSubject &&
      year &&
      fileUrl != null&&
      resourceType &&
      sessionYear
    ) {
      const data = {
        label: label,
        type: resourceType.value,
        branch: selectedBranch.value,
        code: selectedSubject.value,
        collegeYear: year.value,
        sessionYear: sessionYear.value,
        file: fileUrl?.replace("view", "preview"),
        university: selectedUniversity.value,
      };
      try {
        setIsSubmitting(true);
        const res = await axios.post(`/api/contributor`, data);
        if (res.status === 200) {
          toast({
            title: "Your contribution was added thank you",
            variant: "default",
            color: "#008000",
          });
        } else {
          toast({
            title: "Some error occured",
            variant: "destructive",
            color: "red",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.data) {
          console.log(axiosError.response.data);
          toast({
            title: "Some error occured",
            variant: "destructive",
            color: "red",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Please Fill out all the fields",
        variant: "destructive",
        color: "yellow",
      });
    }
  };

  // for fetching the subjects
  useEffect(() => {
    const params: any = {};
    if (year) {
      params.year = year.value;
    }
    if (selectedBranch) {
      params.branch = selectedBranch.value;
    }
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`/api/subjects`, { params: params });
        const data = res.data;
        if (data.success) {
          setSubjects(data.subjects);
        }
      } catch (error) {
        toast({ title: "Error Occured", variant: "destructive", color: "red" });
      }
    };
    fetchSubjects();
  }, [year, selectedBranch]);
  return (
    <>
      {isContributor ? (
        <>
          <div className="flex justify-center ">
            <div className="grid md:grid-cols-2 sm:grid-cols-1 justify-items-center gap-5 ">
              {!fileUrl ? (
                <FileUpload
                  fileUrl={fileUrl}
                  setFileUrl={(v: string | null) => {
                    setFileUrl(v);
                  }}
                  setLabel={(v:string)=>{setLabel(v)}}
                  fileType="pdf"
                />
              ) : (
                <div className="bg-slate-800 rounded-md flex justify-around col-span-2 w-full h-[200px]">
                  <FileText size={50} className="text-white" />
                  <p className="font-bold text-xl font-white">{label}</p>
                </div>
              )}

              <div className="grid col-span-2 gap-1">
                <Label className="text-gray-800">Label</Label>
                {/* label */}
                <Input
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value);
                  }}
                  className="w-[500px] mb-5 text-white "
                  type="text"
                />
              </div>
              <ComboBox
                options={resourceTypes}
                label="Select Resource Type"
                stateSetter={setResourceType}
              />
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
              {/* Branch */}
              {year.value != "1" && (
                <ComboBox
                  options={branches}
                  label="Select Branch"
                  stateSetter={setSelectedBranch}
                />
              )}
              <ComboBox
                options={yearTillNow()}
                stateSetter={setSessionYear}
                label="Session Year"
              />
              <ComboBox
                options={subjects}
                label="Select Subject"
                stateSetter={setSelectedSubject}
              />
              {/* <ComboBox
                options={universities}
                label="Select University"
                stateSetter={setSelectedUniversity}
              /> */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-yellow-300 w-32 hover:bg-yellow-400 text-black"
                >
                  {!isSubmitting ? (
                    "Upload"
                  ) : (
                    <>
                      <p>Uploading</p>
                      <Loader2 className="animate-spin" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center mt-20 bg-slate-950 text-white">
            <div className="bg-slate-800/30 p-6 rounded-lg shadow-lg max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4">
                Not a Contributor Yet?
              </h2>
              <p className="mb-6">
                You are not currently a contributor. Click the link below to
                fill out the form and become a contributor.
              </p>
              <Link
                href="https://forms.gle/5pyeVcoRk68FbE9v8"
                className="text-blue-900"
              >
                Become a contributor
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
