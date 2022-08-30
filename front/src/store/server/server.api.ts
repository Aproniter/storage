import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IChapter, IDocfile, IImage, INote, IProject, ServerResponse } from '../../models'

export const serverApi = createApi({
    reducerPath: 'server/api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BASE_URL
    }),
    endpoints: build => ({
        getProjects: build.query<IProject[], string>({
            query: () => ({
                url: `projects`
            }),
            transformResponse: (response: ServerResponse<IProject>) => response.items
        }),
        getProjectChapters: build.query<IChapter[], number>({
            query: (project: number) => ({
                url: `projects/${project}/get_chapters`
            }),
            transformResponse: (response: ServerResponse<IChapter>) => response.items
        }),
        getProjectNotes: build.query<INote[], number>({
            query: (project: number) => ({
                url: `projects/${project}/get_notes`
            }),
            transformResponse: (response: ServerResponse<INote>) => response.items
        }),
        getChapterNotes: build.query<INote[], number[]>({
            query: (params:number[]) => ({
                url: `projects/${params[0]}/get_notes/?chapter=${params[1]}`
            }),
            transformResponse: (response: ServerResponse<INote>) => response.items
        }),
        getDocfileNotes: build.query<INote[], number[]>({
            query: (params:number[]) => ({
                url: `projects/${params[0]}/get_notes/?docfile=${params[1]}`
            }),
            transformResponse: (response: ServerResponse<INote>) => response.items
        }),
        getDocfiles: build.query<IDocfile[], number[]>({
            query: (params:number[]) => ({
                url: `projects/${params[0]}/get_docfiles/?chapter=${params[1]}`
            }),
            transformResponse: (response: ServerResponse<INote>) => response.items
        }),
        getPreview: build.query<IImage[], number[]>({
            query: (params:number[]) => ({
                url: `projects/${params[0]}/get_preview/?docfile=${params[1]}`
            }),
            transformResponse: (response: ServerResponse<IImage>) => response.items
        })
    })
})

export const { 
    useGetProjectsQuery, useLazyGetProjectChaptersQuery,
    useLazyGetProjectNotesQuery, useLazyGetChapterNotesQuery,
    useLazyGetDocfilesQuery, useLazyGetPreviewQuery,
    useLazyGetDocfileNotesQuery
} = serverApi
