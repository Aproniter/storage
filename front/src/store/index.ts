import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { serverApi } from "./server/server.api";
import authReducer from './slices/authSlice'


const rootReducer = combineReducers({
    [serverApi.reducerPath]: serverApi.reducer,
    auth: authReducer,
})

export function setupStore(){
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']