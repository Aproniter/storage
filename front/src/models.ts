export interface IProject {
    id: number;
    title: string;
    address: string;
    status: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    owner: IOwner;
    editors: number[];
    notes: number[];
    viewers: number[];
}

export interface IOwner {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
}

export interface IChapter {
    id:number;
    title: string;
    notes: number[];
    docfiles: number[];
}

export interface INote {
    id:number;
    title: string;
    text: string;
    note_type: string;
    color: string;
    created_at: string;
    updated_at: string;
    author: IOwner;
    docfile: string;
}

export interface ISendNote {
    id?:number;
    title?:string;
    text?:string;
    project_id?:number;
    chapter_id?:number;
    docfile_id?:number;
    author_id?:number;
}

export interface IDeleteNote {
    note:INote;
    project:IProject
}

export interface IImage {
    id: number;
    path: string;
}

export interface IDocfile{
    id:number;
    title: string;
    chapter?: IChapter;
    subchapter?: string;
    part?: string;
    book?: number;
    code?: string;
    version?: number;
    notes?: INote[];
    updated_at: string;
}

export interface ServerResponse<T> {
    total_count: number;
    links?: {
        next?: string,
        previous?: string,
    }
    results: {
        count: number,
        items: [];
    }
}