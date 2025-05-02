import { configureStore } from "@reduxjs/toolkit"
import clubReducer from "@/lib/slices/clubSlice"
export const makeStore = ()=>{
    return configureStore({
reducer:{
    club:clubReducer
}
    })
}
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']