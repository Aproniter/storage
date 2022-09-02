import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '..'
import { IDocfile, IImage, INote, ISendNote, ServerResponse } from '../../models'

export interface CustomError {
    'status': number,
    'data':{
        'detail': string
    }
}

export const serverApi = createApi({
    reducerPath: 'server/api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token
            if (token) {
              headers.set('authorization', `Token ${token}`)
            }
            headers.set('content-type', 'application/json')
            return headers
          },
    }) as BaseQueryFn<string | FetchArgs, unknown, CustomError, {}>,
    endpoints: build => ({
        getProjects: build.query<ServerResponse<any>, number>({
            query: (page) => ({
                url: `projects/?page=${page}`,
            }),
            keepUnusedDataFor: 100,
        }),
        getProjectChapters: build.query<ServerResponse<any>, number[]>({
            query: (params: number[]) => ({
                url: `projects/${params[0]}/get_chapters/?page=${params[1]}`
            }),
            keepUnusedDataFor: 100,
        }),
        getProjectNotes: build.query<INote[], number>({
            query: (project: number) => ({
                url: `projects/${project}/get_notes`
            }),
            keepUnusedDataFor: 100,
            transformResponse: (response: ServerResponse<INote>) => response.results.items
        }),
        getChapterNotes: build.query<INote[], number[]>({
            query: (params:number[]) => ({
                url: `projects/${params[0]}/get_notes/?chapter=${params[1]}`
            }),
            keepUnusedDataFor: 100,
            transformResponse: (response: ServerResponse<INote>) => response.results.items
        }),
        getDocfileNotes: build.query<INote[], number[]>({
            query: (params:number[]) => ({
                url: `projects/${params[0]}/get_notes/?docfile=${params[1]}`
            }),
            keepUnusedDataFor: 100,
            transformResponse: (response: ServerResponse<INote>) => response.results.items
        }),
        getDocfiles: build.query<IDocfile[], number[]>({
            query: (params:number[]) => ({
                url: `projects/${params[0]}/get_docfiles/?chapter=${params[1]}`
            }),
            keepUnusedDataFor: 100,
            transformResponse: (response: ServerResponse<IDocfile>) => response.results.items
        }),
        getPreview: build.query<IImage[], number[]>({
            query: (params:number[]) => ({
                url: `projects/${params[0]}/get_preview/?docfile=${params[1]}`
            }),
            keepUnusedDataFor: 100,
            transformResponse: (response: ServerResponse<IImage>) => response.results.items
        }),
        sendNote: build.mutation<INote, Partial<ISendNote>>({
            query: (body) => ({
                url: `notes/`,
                method: 'POST',
                body
            }),
        }),
        deleteNote: build.mutation<ServerResponse<any>, number[]>({
            query(params){
                return{
                    url: `projects/${params[0]}/delete_note`,
                    method: 'DELETE',
                    body: {
                        'note_id':params[1]
                    }
                }
            },
        }),
    })
})

export const { 
    useGetProjectsQuery, useLazyGetProjectsQuery,
    useLazyGetProjectChaptersQuery, useLazyGetProjectNotesQuery,
    useLazyGetChapterNotesQuery, useLazyGetDocfilesQuery,
    useLazyGetPreviewQuery, useLazyGetDocfileNotesQuery, useSendNoteMutation,
    useDeleteNoteMutation
} = serverApi
