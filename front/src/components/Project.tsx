import { useEffect, useState } from 'react'
import { IProject, IChapter } from '../models'
import { useLazyGetProjectChaptersQuery, useLazyGetProjectNotesQuery } from '../store/server/server.api'
import { Chapter } from './Chapter'
import { Downloading } from './Downloading'
import { Note } from './Note'
import { NoteForm } from './NoteForm'
import { Pagination } from './Pagination'

interface ProjectProps {
    project: IProject
}

export function Project({ project }: ProjectProps) {
    const [chaptersVisible, setChaptersVisible] = useState(false)
    const [notesVisible, setNotesVisible] = useState(false)
    const [noteFormVisible, setNoteFormVisible] = useState(false)
    const [needNotesUpdate, setNeedNotesUpdate] = useState(false)
    const [chapters, setChapters] = useState([])
    const [nextPage, setNextPage] = useState('')
    const [prevPage, setPrevPage] = useState('')
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)

    const [fetchChapters, {isLoading:chaptersLoading, data:chaptersData}] = useLazyGetProjectChaptersQuery()
    const [fetchNotes, {isLoading:notesLoading, data:notes}] = useLazyGetProjectNotesQuery()

    const getChapters = (project_id: number, page:number) => {
        if(!chaptersVisible){
            fetchChapters([project_id, page])
        }
        setChaptersVisible (prev => !prev)
    }

    useEffect(() => {
        if(needNotesUpdate){
            setTimeout(() => {
                fetchNotes(project.id);
            }, 100);
            
            setNeedNotesUpdate(false)
        }
      }, [needNotesUpdate, fetchNotes, project.id, notes]);

    const getNotes = (project_id: number) => {
        if(!notesVisible){
            fetchNotes(project_id)
        }
        setNotesVisible (prev => !prev)
    }

    function pages(){
        let pages:number[] = []
        for(let i =1; i <= totalPages; i++){
            pages.push(i)
        }
        return pages
    }

    useEffect(() => {
        if(chaptersVisible){
            fetchChapters([project.id, page])
        }
        
    }, [project.id, page, fetchChapters, chaptersVisible])

    useEffect(() => {
        if(chaptersData){
            setChapters(chaptersData.results.items)
            if(chaptersData.links){
                if(chaptersData.links.next){
                    setNextPage(chaptersData.links.next.split('?page=')[1])
                }
                if(chaptersData.links.previous){
                    setPrevPage(chaptersData.links.previous.split('?page=')[1])
                }
            }
            if(chaptersData.total_count){
                setTotalPages(Math.ceil(chaptersData.total_count / 5))
            }
        }
      }, [chaptersData]);

    return (
        <div 
            className="project w-full flex flex-col rounded bg-gray-300 mb-2"
        >
            <div className='project_header flex justify-between'>
                <span className='flex flex-col justify-between'>
                    <span className='project_title p-2 w-full flex text-2xl font-bold relative'><p>{ project.title }</p></span>
                    <span className='project_address p-2 w-full flex relative'><p>{project.address}</p></span>
                    <span className='project_owner p-2 relative'><p>{project.owner.first_name} {project.owner.last_name}</p></span>
                    <span className='project_stage p-2 w-full flex relative'><p>{project.status}</p></span>
                </span>
                <span className='px-2 flex flex-col justify-between'>
                    <div className='project_buttons p-2 w-full flex flex-col items-end justify-end'>
                        <div className='p-1 hover:shadow shadow-2xl mr-1 '>
                            <span 
                                className='text-xs mb-1 cursor-pointer'
                                onClick={() => getChapters(project.id, page)}
                            >Разделы</span>
                        </div>
                        <div className='p-1 hover:shadow shadow-2xl  mr-1'>
                            <span 
                                className='text-xs mb-1 cursor-pointer'
                                onClick={() => getNotes(project.id)}
                            >Заметки</span>
                        </div>
                        <div className='p-1 hover:shadow shadow-2xl mr-1 '>
                            <span 
                                className='text-xs mb-1 cursor-pointer'
                                onClick={() => setNoteFormVisible( prev => !prev)}
                            >Добавить заметку</span>
                        </div>
                    </div>
                    <span className='project_updated_at p-2 relative text-center'>
                        <p className='bg-gray-400 rounded p-1'>Последние изменения: {project.updated_at}</p>
                    </span>
                </span>
                
            </div>
            {noteFormVisible && <NoteForm parent={{'project_id':project.id}} updateNotes={setNeedNotesUpdate} setNoteFormVisible={setNoteFormVisible}/>}
            {notesVisible && 
            <ul className='overflow-y-scroll max-h-[400px] overflow-hidden p-1'>
            {notes?.map(note => 
            <li key={note.id}>
                <Note note={note} project={project} updateNotes={setNeedNotesUpdate}/>
            </li>
            )}
            </ul>
            }
            {(nextPage || prevPage) && chaptersVisible && <Pagination pageNumber={page} pages={pages()} setPage={setPage}/>}
            {(chaptersLoading || notesLoading) &&  <div className="flex w-full justify-center"><Downloading/></div>}
            {chaptersVisible && chapters && chapters.length > 0 && <div className='chapters m-2'>{chapters.map((chapter:IChapter) => <Chapter project={project} chapter={chapter} key={chapter.id}/>)}</div>}
        </div>
        
    )
}