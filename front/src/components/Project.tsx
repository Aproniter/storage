import axios from 'axios'
import { useState } from 'react'
import { IChapter, INote, IProject } from '../models'
import { Chapter } from './Chapter'
import { Note } from './Note'

const BaseURL = process.env.REACT_APP_BASE_URL

interface ProjectProps {
    project: IProject
}

export function Project({ project }: ProjectProps) {
    const haveNotes = project.notes.length > 0
    const iconColorClassName = haveNotes ? 'fill-red-500' : 'fill-grey-500'
    const iconClasses = ["w-8 h-8", iconColorClassName]
    const [chapters, setChapters] = useState<IChapter[]>([])
    const [chaptersVisible, setChaptersVisible] = useState(false)
    const [notes, setNotes] = useState<INote[]>([])
    const [notesVisible, setNotesVisible] = useState(false)

    async function fetchChapters(proj: number) {
        if(chapters.length === 0){
            const responce = await axios.get<IChapter[]>(BaseURL+'/chapters/?project='+ proj)
            setChapters(responce.data)
        } 
        setChaptersVisible (prev => !prev)
    }

    async function fetchNotes(ids: number[]) {
        if(notes.length === 0){
            const responce = await axios.get<INote[]>(BaseURL+'/notes/?ids='+ids.join(','))
            setNotes(responce.data)
        } 
        setNotesVisible (prev => !prev)
    }

    return (
        <div 
            className="project w-full flex flex-col border-b border-indigo-200"
        >
            <div className='project_header flex justify-between items-center'>
                <span className='project_title p-2 h-full w-full flex justify-center items-center relative'><p>{ project.title }</p></span>
                <span className='project_stage p-2 h-full w-full flex justify-center items-center relative'><p>{project.status}</p></span>
                <span className='project_address p-2 h-full w-full flex justify-center items-center relative'><p>{project.address}</p></span>
                <span className='project_updated_at p-2 h-full w-full flex justify-center items-center relative'><p>{project.updated_at}</p></span>
                <span className='project_owner p-2 h-full w-full flex justify-center items-center relative'><p>{project.owner.first_name} {project.owner.last_name}</p></span>
                <div className='project_buttons p-2 h-full w-full flex justify-around flex-col items-center'>
                    <div data-tooltip='Показать/скрыть заметки' className='p-1 hover:shadow shadow-2xl'>
                        <svg
                            className={iconClasses.join(' ')}
                            onClick={haveNotes ? () => fetchNotes(project.notes) : () => false}
                            xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M20,0H4A4,4,0,0,0,0,4V16a4,4,0,0,0,4,4H6.9l4.451,3.763a1,1,0,0,0,1.292,0L17.1,20H20a4,4,0,0,0,4-4V4A4,4,0,0,0,20,0Zm2,16a2,2,0,0,1-2,2H17.1a2,2,0,0,0-1.291.473L12,21.69,8.193,18.473h0A2,2,0,0,0,6.9,18H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H20a2,2,0,0,1,2,2Z"/><path d="M7,7h5a1,1,0,0,0,0-2H7A1,1,0,0,0,7,7Z"/><path d="M17,9H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/><path d="M17,13H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/>
                        </svg>
                    </div>
                    <div data-tooltip='Показать/скрыть разделы' className='p-1 hover:shadow shadow-2xl'>
                        <svg
                            className="w-8 h-8 fill-gray-500"
                            onClick={() => fetchChapters(project.id)}
                            xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M1,6H23a1,1,0,0,0,0-2H1A1,1,0,0,0,1,6Z"/><path d="M23,9H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/><path d="M23,19H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/><path d="M23,14H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/>
                        </svg>
                    </div>
                </div>
            </div>
            {notesVisible && notes.map(note => <Note note={note} key={note.id}/>)}
            {chaptersVisible && chapters.map(chapter => <Chapter project={project} chapter={chapter} key={chapter.id}/>)}
        </div>
    )
}