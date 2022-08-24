export interface IProject {
    id: number
    title: string
    address: string
    status: string
    active: boolean
    created_at: string
    updated_at: string
    owner: IOwner
    editors: number[]
    notes: number[]
    viewers: number[]
}

export interface IOwner {
    id: number
    email: string
    username: string
    first_name: string
    last_name: string
}

export interface IChapter {
    id:number
    title: string
    notes: number[]
    docfiles: number[]
}

export interface INote {
    id:number
    title: string
    text: string
    note_type: string
    color: string
    created_at: string
    updated_at: string
    author: IOwner
    docfile: string
}

export interface IImage {
    id: number
    data: string
}

export interface IDocfile{
    id:number
    title: string
    chapter?: IChapter
    subchapter?: string
    part?: string
    book?: number
    code?: string
    version?: number
    notes?: INote[]
    updated_at: string
}