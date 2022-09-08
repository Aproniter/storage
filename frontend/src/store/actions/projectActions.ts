import { AppDispatch } from '..'
import instance from '../../axios' 
import { IProject, ListServerResponse } from '../../models'
import { projectSlice } from '../slices/projectSlice'

export const fetchProjects = (page:number = 1) => {
    return async(dispatch:AppDispatch) => {
        try {
            dispatch(projectSlice.actions.fetching())
            const resp = await instance.get<ListServerResponse<IProject[]>>(
                'projects/', {
                    params: { page }
                }
            )
            dispatch(projectSlice.actions.fetchingSuccess({
                projects: resp.data.results.items,
                total_count: resp.data.total_count,
            }))
        } catch(e) {
            dispatch(projectSlice.actions.fetchError(e as Error))
        }
    }
}