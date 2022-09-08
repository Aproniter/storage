import { AppDispatch } from '..'
import instance from '../../axios' 
import { IDocfile, ListServerResponse } from '../../models'
import { docfileSlice } from '../slices/docfileSlice'

export const fetchDocfiles = (project_id:number, chapter:number) => {
    return async(dispatch:AppDispatch) => {
        try {
            dispatch(docfileSlice.actions.fetching())
            const resp = await instance.get<ListServerResponse<IDocfile[]>>(
                `projects/${project_id}/get_docfiles/`, {
                    params: { chapter }
                }
            )
            dispatch(docfileSlice.actions.fetchingSuccess({
                docfiles: resp.data.results.items,
                total_count: resp.data.total_count,
                chapter: resp.data.results.items.length > 0 ? resp.data.results.items[0].chapter : NaN
            }))
        } catch(e) {
            dispatch(docfileSlice.actions.fetchError(e as Error))
        }
    }
}