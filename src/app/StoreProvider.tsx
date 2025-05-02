"use client"

import { AppStore, makeStore } from "@/lib/store"
import { useRef } from "react"
import { Provider } from "react-redux";

export default function StoreProvider({children}:{
    children:React.ReactNode
}){
    //@ts-ignore
    const storeRef = useRef<AppStore>(undefined);
    if(!storeRef.current){
        storeRef.current = makeStore();
    }
    return <Provider store={storeRef.current}>{children}</Provider>
}