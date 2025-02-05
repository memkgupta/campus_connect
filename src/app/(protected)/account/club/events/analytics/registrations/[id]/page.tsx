"use client"
import { RegistrationDetails } from '@/components/club/analytics/registrations/registration-details'
import { toast } from '@/components/ui/use-toast'
import { BACKEND_URL } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import Cookies from 'js-cookie'
import Loader from '@/components/loader'
const Page = ({params}:{params:{id:string}}) => {
    const mockRegistration ={
        _id: "6770e305536489b1008777db",
        event: {
          name: "MERN STACK MASTER CLASS",
          description: "Attend a 6 hour long complete master class for mern stack",
          dateTime: "2024-12-31T07:30:00.000Z",
          banner: "https://utfs.io/f/2dfb278c-ac05-45bb-9f1f-62b215878cea-59fsqg.png"
        },
        user: {
          profile: "https://utfs.io/f/185946c1-02dc-4179-9ccd-c5e0691923a1-q4ny73.png",
          name: "Mayank Gupta",
          email: "cse23282@glbitm.ac.in",
          username: "mkg"
        },
        status: "completed",
        registrationForm: [
          {
            _id: "6770e3a2536489b100877800",
            fields: [
              {
                _id: 1735451466593,
                fieldLabel: "Name",
                fieldType: "text",
                isRequired: true,
                options: [],
                placeholder: "Enter your name"
              },
              {
                _id: 1735451487673,
                fieldLabel: "Branch",
                fieldType: "text",
                isRequired: true,
                options: [],
                placeholder: "Enter your branch"
              },
              {
                _id: 1735451501553,
                fieldLabel: "Why you want to attend this",
                fieldType: "textarea",
                isRequired: true,
                options: [],
                placeholder: "Describe "
              }
            ]
          }
        ],
        submission: {
          submissionData: {
            1735451466593: "Mayank Gupta",
            1735451487673: "CSE",
            1735451501553: "Just want to attend"
          }
        }
      }
      const fetchRegistration = async()=>{
        try {
          const res = await axios.get(`${BACKEND_URL}/events/registrations/${params.id}`,
            {headers:{
              "Authorization":`Bearer ${Cookies.get('access-token')}`
            }}
          )
          return res.data.data;
        } catch (error) {
          toast({
            title:"Some error occured",
            variant:"destructive"
          })
        return  Promise.reject("Some error occured")
        }
      }
      const {data,isLoading} = useQuery({
        queryKey:['registration',params.id],
        queryFn:fetchRegistration,
        retry:false,
        refetchOnWindowFocus:false
      })
  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
     {
      isLoading?(<Loader/>):(
        <>
        {data &&  <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-8">
          Registration Details
        </h1>
        
       
         
          <RegistrationDetails registration={data} />
       
      </div>}
        </>
      )
     }
    </div>
  )
}

export default Page