"use client"
import AssignmentDialog from '@/components/club/events/dashboard/assignments/add_assignment_dialog'
import { FormPreview } from '@/components/club/forms/form-builder/form-preview'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEventDashboard } from '@/context/dashboard/useContext'
import { format } from 'date-fns'
import Link from 'next/link'
import React from 'react'

const AssignmentPage = ({params}:{params:{id:string,aid:string}}) => {
    const {data:event,setData} = useEventDashboard()!
    const assignment = event.assignments.find((assignment:any)=>assignment._id === params.aid);
    const form = event.forms.find((form:any)=>form._id === assignment.form)
    const handleUpdate =(updated:any)=>{
      const updatedAssignments = event.assignments.map((a:any)=>{
        if(a._id === assignment._id)
        {
          return updated
        }
        else{
          return a
        }
      })
    }
    return (
    <div>
    
    
       <Card className='mt-12'>
          <div className='flex justify-end mt-12'>
      <AssignmentDialog isEditing initialData={assignment} handleUpdate= {handleUpdate}/>

      </div>
          <CardHeader className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{assignment.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {assignment.description}
              </p>
            </div>
            {assignment.leadOnly && (
              <Badge variant="destructive" className="h-fit">
                Lead Only
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Submission Deadline:</strong>{" "}
              {format(new Date(assignment.submissionDeadline), "PPP p")}
            </div>
            <div>
              <strong>Form ID:</strong> {assignment.form}
            </div>

            {assignment.links.length > 0 && (
              <div>
                <strong>Links:</strong>
                <ul className="list-disc ml-4 space-y-1">
                  {assignment.links.map((link:any, idx:number) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {link.title}
                      </a>{" "}
                      - <span className="text-muted-foreground">{link.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          </Card>
          <div className='px-12 mt-12'>
          
          </div>
          <Card>
            <CardHeader>Form attached</CardHeader>
            <CardContent>
              <div className='flex justify-end'>
                <Link href={`/dashboard/events/${params.id}/forms/${form._id}`} className='border border-white rounded-md p-2 mr-2 mt-2'>View</Link>
              </div>
            <FormPreview fields={form.fields}/>

            </CardContent>
          </Card>
      </div>
  )
}

export default AssignmentPage