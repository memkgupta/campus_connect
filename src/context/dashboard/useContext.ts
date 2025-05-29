import { useContext } from "react"
import { EventContext } from "./EventContext"

export const useEventDashboard = ()=>{
    const context = useContext(EventContext)
    return context
}