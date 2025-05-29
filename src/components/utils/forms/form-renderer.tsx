import { useEventDashboard } from '@/context/dashboard/useContext'
import React from 'react'

const FormSubmissionRenderer = ({data,formId}:{data:any,formId:any}) => {
    const {data:event,} = useEventDashboard()!
    const form = event.forms.find((f:any)=>f._id===formId)
    let mappedSubmissions:any = {}
    Object.entries(data).forEach(([key,value])=>{
        const fieldLabel = form.fields.find((field:any)=>field._id==key).fieldLabel
        if(!mappedSubmissions[fieldLabel])
        {
            mappedSubmissions[fieldLabel] = value;
        }
    })
    console.log(mappedSubmissions)
  return (
    <div>
        {mappedSubmissions && (
            Object.entries(mappedSubmissions).map(([Key,value]:any)=>(
                <p>{Key} : {value}</p>
            ))
        )}
    </div>
  )
}

export default FormSubmissionRenderer