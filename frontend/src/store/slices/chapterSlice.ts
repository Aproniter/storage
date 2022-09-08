import { IChapter } from "../../models"
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ChapterState {
    loading: boolean
    error: string
    chapters: IChapter[]
    total_count: number
}

const initialState:ChapterState = {
    loading: false,
    error: '',
    chapters: [],
    total_count: 0
}

interface ChapterPayload {
    chapters: IChapter[],
    total_count: number
}

export const chapterSlice = createSlice({
    name: 'chapter',
    initialState,
    reducers: {
        fetching(state) {
            state.loading = true
            state.error = ''
        },
        fetchingSuccess(state, action: PayloadAction<ChapterPayload>) {
            state.loading = false
            state.chapters = action.payload.chapters
            state.total_count = action.payload.total_count
            state.error = ''
        },
        fetchError(state, action: PayloadAction<Error>){
            state.loading = false
            state.error = action.payload.message
        }
    }
})

export default chapterSlice.reducer