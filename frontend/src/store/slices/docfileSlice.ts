import { IDocfile } from "../../models"
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DocfileState {
    loading: boolean
    error: string
    docfiles: IDocfile[]
    total_count: number
    chapter_id: number
}

const initialState:DocfileState = {
    loading: false,
    error: '',
    docfiles: [],
    total_count: 0,
    chapter_id: NaN
}

interface DocfilePayload {
    docfiles: IDocfile[],
    chapter: number | undefined
    total_count: number
}

export const docfileSlice = createSlice({
    name: 'docfile',
    initialState,
    reducers: {
        fetching(state) {
            state.loading = true
            state.error = ''
        },
        fetchingSuccess(state, action: PayloadAction<DocfilePayload>) {
            state.loading = false
            state.docfiles = action.payload.docfiles
            state.total_count = action.payload.total_count
            state.chapter_id = action.payload.chapter ? action.payload.chapter : NaN
            state.error = ''
        },
        fetchError(state, action: PayloadAction<Error>){
            state.loading = false
            state.error = action.payload.message
        }
    }
})

export default docfileSlice.reducer