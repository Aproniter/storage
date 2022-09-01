import { useEffect, useState } from 'react'
import { IProject, IChapter } from '../models'
import { useLazyGetProjectChaptersQuery, useLazyGetProjectNotesQuery } from '../store/server/server.api'
import { Chapter } from './Chapter'
import { Downloading } from './Downloading'
import { Note } from './Note'
import { Pagination } from './Pagination'

interface ProjectProps {
    project: IProject
}

export function Project({ project }: ProjectProps) {
    const haveNotes = project.notes.length > 0
    const iconColorClassName = haveNotes ? 'fill-red-500' : 'fill-grey-500'
    const iconClasses = ["w-8 h-8", iconColorClassName]
    const [chaptersVisible, setChaptersVisible] = useState(false)
    const [notesVisible, setNotesVisible] = useState(false)
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
        fetchChapters([project.id, page])
    }, [project.id, page, fetchChapters])

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
                            onClick={() => getNotes(project.id)}
                            xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M20,0H4A4,4,0,0,0,0,4V16a4,4,0,0,0,4,4H6.9l4.451,3.763a1,1,0,0,0,1.292,0L17.1,20H20a4,4,0,0,0,4-4V4A4,4,0,0,0,20,0Zm2,16a2,2,0,0,1-2,2H17.1a2,2,0,0,0-1.291.473L12,21.69,8.193,18.473h0A2,2,0,0,0,6.9,18H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H20a2,2,0,0,1,2,2Z"/><path d="M7,7h5a1,1,0,0,0,0-2H7A1,1,0,0,0,7,7Z"/><path d="M17,9H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/><path d="M17,13H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/>
                        </svg>
                    </div>
                    <div data-tooltip='Показать/скрыть разделы' className='p-1 hover:shadow shadow-2xl'>
                        <svg
                            className="w-8 h-8 fill-gray-500"
                            onClick={() => getChapters(project.id, page)}
                            xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M1,6H23a1,1,0,0,0,0-2H1A1,1,0,0,0,1,6Z"/><path d="M23,9H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/><path d="M23,19H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/><path d="M23,14H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/>
                        </svg>
                    </div>
                </div>
            </div>
            {notesVisible && notes?.map(note => <Note note={note} key={note.id}/>)}
            {(chaptersLoading || notesLoading) &&  <div className="flex w-full justify-center"><Downloading/></div>}
            {chaptersVisible && chapters && chapters.length > 0 && chapters.map((chapter:IChapter) => <Chapter project={project} chapter={chapter} key={chapter.id}/>)}
            {(nextPage || prevPage) && chaptersVisible && <Pagination pageNumber={page} pages={pages()} setPage={setPage}/>}
        </div>
        
    )
}