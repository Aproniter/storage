import { IProject } from "../../models"
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProjectState {
    loading: boolean
    error: string
    projects: IProject[]
    total_count: number
}

const initialState:ProjectState = {
    loading: false,
    error: '',
    projects: [],
    total_count: 0
}

interface ProjectPayload {
    projects: IProject[],
    total_count: number
}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        fetching(state) {
            state.loading = true
            state.error = ''
        },
        fetchingSuccess(state, action: PayloadAction<ProjectPayload>) {
            state.loading = false
            state.projects = action.payload.projects
            state.total_count = action.payload.total_count
            state.error = ''
        },
        fetchError(state, action: PayloadAction<Error>){
            state.loading = false
            state.error = action.payload.message
        }
    }
})

export default projectSlice.reducer