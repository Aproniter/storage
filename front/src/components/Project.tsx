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
    const haveNotes = project.notes.length > 0
    const [chaptersVisible, setChaptersVisible] = useState(false)
    const [notesVisible, setNotesVisible] = useState(false)
    const [noteFormVisible, setNoteFormVisible] = useState(false)
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

    const getNotes = (project_id: number) => {
        if(!notesVisible && haveNotes){
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
                    <div className='project_buttons p-2 w-full flex justify-end'>
                        <div data-tooltip='Показать/скрыть' className='p-1 hover:shadow shadow-2xl mr-1 items-center flex flex-col'>
                            <span className='text-xs mb-1'>разделы</span>
                            <svg
                                className="w-8 h-8 fill-gray-500"
                                onClick={() => getChapters(project.id, page)}
                                xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M1,6H23a1,1,0,0,0,0-2H1A1,1,0,0,0,1,6Z"/><path d="M23,9H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/><path d="M23,19H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/><path d="M23,14H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/>
                            </svg>
                        </div>

                        {haveNotes && <div data-tooltip='Показать/скрыть' className='p-1 hover:shadow shadow-2xl items-center flex flex-col mr-1'>
                            <span className='text-xs mb-1'>заметки</span>
                            <svg
                                className="w-8 h-8 fill-red-500"
                                onClick={() => getNotes(project.id)}
                                xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M20,0H4A4,4,0,0,0,0,4V16a4,4,0,0,0,4,4H6.9l4.451,3.763a1,1,0,0,0,1.292,0L17.1,20H20a4,4,0,0,0,4-4V4A4,4,0,0,0,20,0Zm2,16a2,2,0,0,1-2,2H17.1a2,2,0,0,0-1.291.473L12,21.69,8.193,18.473h0A2,2,0,0,0,6.9,18H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H20a2,2,0,0,1,2,2Z"/><path d="M7,7h5a1,1,0,0,0,0-2H7A1,1,0,0,0,7,7Z"/><path d="M17,9H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/><path d="M17,13H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/>
                            </svg>
                        </div>}

                        <div data-tooltip='добавить заметку' className='p-1 hover:shadow shadow-2xl mr-1 items-center flex flex-col justify-center'>
                            
                            <svg
                                className="w-4 h-4 fill-gray-500"
                                 onClick={() => setNoteFormVisible( prev => !prev)}
                                xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M23,11H13V1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1V11H1a1,1,0,0,0-1,1H0a1,1,0,0,0,1,1H11V23a1,1,0,0,0,1,1h0a1,1,0,0,0,1-1V13H23a1,1,0,0,0,1-1h0A1,1,0,0,0,23,11Z"/>
                            </svg>
                        </div>
                    </div>
                    <span className='project_updated_at p-2 relative text-center'>
                        <p className='bg-gray-400 rounded p-1'>Последние изменения: {project.updated_at}</p>
                    </span>
                </span>
                
            </div>
            {noteFormVisible && <NoteForm parent={{'project_id':project.id}} setNoteFormVisible={setNoteFormVisible}/>}
            {notesVisible && <div className='notes m-2 border p-1'>{notes?.map(note => <Note note={note} key={note.id}/>)}</div>}
            {(chaptersLoading || notesLoading) &&  <div className="flex w-full justify-center"><Downloading/></div>}
            {chaptersVisible && chapters && chapters.length > 0 && <div className='chapters m-2'>{chapters.map((chapter:IChapter) => <Chapter project={project} chapter={chapter} key={chapter.id}/>)}</div>}
            {(nextPage || prevPage) && chaptersVisible && <Pagination pageNumber={page} pages={pages()} setPage={setPage}/>}
        </div>
        
    )
}