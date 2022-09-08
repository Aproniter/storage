import { AppDispatch } from '..'
import instance from '../../axios' 
import { IChapter, ListServerResponse } from '../../models'
import { chapterSlice } from '../slices/chapterSlice'

export const fetchChapters = (page:number = 1, project_id:number) => {
    return async(dispatch:AppDispatch) => {
        try {
            dispatch(chapterSlice.actions.fetching())
            const resp = await instance.get<ListServerResponse<IChapter[]>>(
                `projects/${project_id}/get_chapters/`, {
                    params: { page }
                }
            )
            dispatch(chapterSlice.actions.fetchingSuccess({
                chapters: resp.data.results.items,
                total_count: resp.data.total_count,
            }))
        } catch(e) {
            dispatch(chapterSlice.actions.fetchError(e as Error))
        }
    }
}