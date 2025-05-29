import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEventDashboard } from '@/context/dashboard/useContext'
import { useEventContext } from '@/context/EventContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const TeamAssignmentList = ({submissions,assignments}:{submissions:any,assignments:any}) => {
    const {data:event} = useEventContext()!;
    const pathName = usePathname()
   assignments = assignments.reduce((acc:any,curr:any)=>{
        const key = curr._id;
        if(!acc[key])
        {
            acc[key] = {...curr}
            if(submissions[key])
            {
                acc[key]["submission"] = submissions[key][0]
                acc[key]["filled"] = true;
            }
            
        }
        return acc;
    },{}) 
    return (
    <div>
        {
            Object.entries(assignments).map(([key,value]:[key:string,value:any],index:number)=>(
                <Card key={key}>
                     <CardHeader className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{value.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
            {value.leadOnly && (
              <Badge variant="destructive" className="h-fit">
                Lead Only
              </Badge>
            )}
            {
                value.filled && 
                (
                    <Badge variant={"secondary"} className='h-fit'>
                        Filled
                    </Badge>
                )
            }
            {!value.filled && 
            (
                <div className='flex justify-end'>
                <Link href={`${pathName}/assignment/${value._id}`} className='border border-white rounded-md p-2'>Submit</Link>

                </div>
            )}
            {}
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full">
            {
                
                value.submissions?.map((s:any)=>(
                    <Card>
                        <CardHeader>

                        </CardHeader>
                    </Card>
                ))
            }

    </Accordion>
          </CardContent>
                </Card>
            ))
        }
    </div>
  )
}

export default TeamAssignmentList