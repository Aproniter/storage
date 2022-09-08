import { combineReducers, configureStore } from '@reduxjs/toolkit'
import projectReducer from './slices/projectSlice'
import chapterReducer from './slices/chapterSlice'
import docfileReducer from './slices/docfileSlice'

const rootReducer = combineReducers({
    project: projectReducer,
    chapter: chapterReducer,
    docfile: docfileReducer,
})


export function setupStore() {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']