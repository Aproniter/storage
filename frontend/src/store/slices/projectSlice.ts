import { IProject } from "../../models"
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProjectState {
    loading: boolean
    error: string
    projects: IProject[]
}

const initialState:ProjectState = {
    loading: false,
    error: '',
    projects: []
}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        fetching(state) {
            state.loading = true
            state.error = ''
        },
        fetchingSuccess(state, action: PayloadAction<IProject[]>) {
            state.loading = false
            state.projects = action.payload
        },
        fetchError(state, action: PayloadAction<Error>){
            state.loading = false
            state.error = action.payload.message
        }
    }
})

export default projectSlice.reducer