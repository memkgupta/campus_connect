import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FormSubmission, Member, RegistrationDetails } from '@/types/events'
import React from 'react'

const TeamMemberCard = ({member,registrationDetail}:{member:Member,registrationDetail:RegistrationDetails}) => {
  return (
   <>
    <div
                      key={member._id}
                      className="p-4 border border-gray-700 rounded-md shadow-sm bg-[#2a2a2a]  "
                    >
                      <div className="flex flex-grow items-center space-x-4">
                        <div>
                          <h4 className="font-medium text-lg">
                            {member.registrationDetails.name}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {member.registrationDetails.email}
                          </p>
                          <p className="text-sm text-gray-400">
                            📞 {member.registrationDetails.phoneNo}
                          </p>
                          <p className="text-sm text-gray-400">
                            🎓 {member.registrationDetails.collegeDetails.collegeName} (Year{" "}
                            {member.registrationDetails.collegeDetails.year})
                          </p>
                          <p className="text-sm text-gray-500">
                            Registered At:{" "}
                            {new Date(
                              member.registrationDetails.registrationTimestamp
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                       <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>View Registration Details</AccordionTrigger>
        <AccordionContent>
         { <div  className="mt-4 border-t border-gray-600 pt-2">
              <p className="text-gray-400 mb-1">Form Submission:</p>
              {Object.entries((registrationDetail.formSubmission as FormSubmission).submissionData).map(([key, value]) => (
                <p key={key}>
            {`${key}:${value}`}
                </p>
              ))}
            </div>}
        </AccordionContent>
      </AccordionItem>
 
    </Accordion>
                    </div>
   </>
  )
}

export default TeamMemberCard