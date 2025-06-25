"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import Step1_EventType from "./steps/step-1";
import Step2_BasicDetails from "./steps/step-2";
import Step3_Structure from "./steps/step-3";
import Step4_MonetaryDetails from "./steps/step-4";
import Step5_OrganiserDetails from "./steps/step-5";
import { Button } from "@/components/ui/button";
import {z} from "zod"
import {
    eventCreationSchema,
  
    eventCreationBasicDetailsSchema,
    eventCreationEventStructureSchema,
    eventCreationMonetoryDetailsSchema,
    eventCreationOrganiserDetailsSchema,
    defaultEventCreationValues
  } from "@/schema/eventRegistrationSchema";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { BACKEND_URL, BACKEND_URL_V2 } from "@/constants";
import { useSession } from "@/hooks/useSession";
  import Cookies from "js-cookie"
import { useRouter } from "next/navigation";
import OverlayLoader from "@/components/ui/overlay-loader";
  const stepSchemas = [
    z.enum(["hackathon","session","workshop","contest","campaign","other","ground-work"]),
    eventCreationBasicDetailsSchema,
    eventCreationEventStructureSchema,
    eventCreationMonetoryDetailsSchema,
    eventCreationOrganiserDetailsSchema
  ];
const steps = [
  Step1_EventType,
  Step2_BasicDetails,
  Step3_Structure,
  Step4_MonetaryDetails,
  Step5_OrganiserDetails,

];
const stepsName = [
  "type",
  "basicDetails",
  "eventStructure",
  "monetaryDetails",
  "organiserDetails"
]
export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [stepValid, setStepValid] = useState<boolean[]>(Array(steps.length).fill(false));
  const {toast} = useToast()
  const router = useRouter()
  const [isSubmitting,setIsSubmitting] = useState(false);
  const methods = useForm({
    resolver: zodResolver(eventCreationSchema),
    mode: "onTouched",
    
    defaultValues:defaultEventCreationValues
  });
    const onNext = async () => {
    const valid = await methods.trigger(stepsName[step] as any);
    if (valid) {
      setStep((prev) => prev + 1);
    }
    else{
      console.log("Bhakk")
    }
  };

  const onBack = () => {
    setStep((prev) => prev - 1);
  };
  const token = Cookies.get("access-token");
  
  const CurrentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const isFirstStep = step === 0;
  const onSubmit = async(data: any) => {
   
    try{
const req = await axios.post(`${BACKEND_URL_V2}/events/admin/add-event?event_organiser_type=individual`,data,{
  headers:{
    "Authorization":`Bearer ${token}`
  }
})
router.push(`/dashboard/events/${req.data.event}`)
router
    }
    catch(error:any){
      toast({
        title:error.message
      })
    }
  };
  // const validateStep = async () => {
  //   const currentValues = methods.getValues();
  
  //   // validate only current step
  //   try {
  //     const stepData =
  //       step === 0 ? {  ...currentValues }.type :
  //       step === 1 ? { ...currentValues.basicDetails } :
  //       step === 2 ? { ...currentValues.eventStructure } :
  //       step === 3 ? { ...currentValues.monetaryDetails } :
  //       step === 4 ? { ...currentValues.organiserDetails } : {};
     
  //     await stepSchemas[step].parseAsync(stepData);
      
  //     // ✅ step valid
  //     const updated = [...stepValid];
  //     updated[step] = true;
  //     setStepValid(updated);
  //     return true;
  
  //   } catch (err) {
  //     toast({
  //       title:'Please fill the information correctly',
  //       variant:'destructive',
       
  //     })
  //     const updated = [...stepValid];
  //     updated[step] = false;
  //     setStepValid(updated);
  //     return false;
  //   }
  // };
  return (
    <>
    <OverlayLoader show={isSubmitting}/>
    <FormProvider {...methods}>
      <div className="flex justify-center w-full min-h-screen bg-background">
        <div className="w-[90%] max-w-4xl pt-8 pb-28"> {/* main container with padding for fixed footer */}
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 h-full overflow-y-auto px-4"
          >
            <CurrentStep />
            <div className="bg-slate-950 fixed bottom-0 left-0 w-full border-t shadow-md py-4 px-4 flex justify-center z-50">
          <div className="w-[90%] max-w-4xl flex justify-between">
             {!isFirstStep && (
            <button
              type="button"
              onClick={onBack}
              className="bg-white text-black px-4 py-2 rounded"
            >
              Back
            </button>
          )}

          {!isLastStep ? (
            <button
              type="button"
              onClick={onNext}
              className="bg-white px-4 py-2 rounded text-black"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-600 px-4 py-2 rounded text-white"
            >
              Submit
            </button>
          )}
          </div>
        </div>
          </form>
        </div>

        {/* Fixed Next/Back Footer */}
      
      </div>
    </FormProvider>
    </>
  );
}
