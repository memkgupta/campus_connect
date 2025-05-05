import { createContext, ReactNode, useState } from "react";

export const EventContext = createContext<{data:any,setData:(data:any)=>void}|null>(null);

export const EventContextProvider = ({children}:{children:ReactNode})=>{
    const [state,setState] = useState(null)
return (
    <EventContext.Provider value={{data:state,setData:setState}}>
        {children}
    </EventContext.Provider>
)
}