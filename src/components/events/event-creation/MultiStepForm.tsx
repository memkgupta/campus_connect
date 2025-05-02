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
import {
    eventCreationSchema,
    eventCreationEventTypeSchema,
    eventCreationBasicDetailsSchema,
    eventCreationEventStructureSchema,
    eventCreationMonetoryDetailsSchema,
    eventCreationOrganiserDetailsSchema
  } from "@/schema/eventRegistrationSchema";
  
  const stepSchemas = [
    eventCreationEventTypeSchema,
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

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [stepValid, setStepValid] = useState<boolean[]>(Array(steps.length).fill(false));
  const methods = useForm({
    resolver: zodResolver(eventCreationSchema),
    mode: "onChange",
    // defaultValues: {
    //   type: { type: "hackathon" },
    //   basicDetails: {
    //     isOnline: false,
    //     isTeamEvent: false,
    //     isFree: true,
    //   },
    // },
  });

  const CurrentStep = steps[step];
 
  const onSubmit = (data: any) => {
    console.log("Final Data ✅", data);
    // submit to API here
  };
  const validateStep = async () => {
    const currentValues = methods.getValues();
  
    // validate only current step
    try {
      const stepData =
        step === 0 ? {  ...currentValues.type } :
        step === 1 ? { ...currentValues.basicDetails } :
        step === 2 ? { ...currentValues.eventStructure } :
        step === 3 ? { ...currentValues.monetaryDetails } :
        step === 4 ? { ...currentValues.organiserDetails } : {};
        console.log(stepData)
      await stepSchemas[step].parseAsync(stepData);
      
      // ✅ step valid
      const updated = [...stepValid];
      updated[step] = true;
      setStepValid(updated);
      return true;
  
    } catch (err) {
      console.log(err)
      // ❌ step invalid
      const updated = [...stepValid];
      updated[step] = false;
      setStepValid(updated);
      return false;
    }
  };
  return (
    <FormProvider {...methods}>
      <div className="flex justify-center w-full min-h-screen bg-background">
        <div className="w-[90%] max-w-4xl pt-8 pb-28"> {/* main container with padding for fixed footer */}
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 h-full overflow-y-auto px-4"
          >
            <CurrentStep />
          </form>
        </div>

        {/* Fixed Next/Back Footer */}
        <div className="bg-slate-950 fixed bottom-0 left-0 w-full border-t shadow-md py-4 px-4 flex justify-center z-50">
          <div className="w-[90%] max-w-4xl flex justify-between">
            {step > 0 && (
              <Button variant="secondary" type="button" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
           {step < steps.length - 1 ? (
  <Button
    type="button"
    onClick={async () => {
      const isValid = await validateStep();
      if (isValid) setStep(step + 1);
    }}
  >
    Next
  </Button>
) : (
  <Button type="submit">Submit</Button>
)}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
