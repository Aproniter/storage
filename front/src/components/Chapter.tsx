import { useEffect, useState } from 'react';
import { IChapter, IProject} from '../models';
import { Note } from './Note';
import { Docfile } from './Docfile';
import { useLazyGetChapterNotesQuery, useLazyGetDocfilesQuery } from '../store/server/server.api';
import { Downloading } from './Downloading';
import { NoteForm } from './NoteForm';

interface ChapterProps {
    project: IProject
    chapter: IChapter
};

export function Chapter({ project, chapter }: ChapterProps) {
    const [notesVisible, setNotesVisible] = useState(false);
    const [docfilesVisible, setDocfilesVisible] = useState(false);
    const [noteFormVisible, setNoteFormVisible] = useState(false)
    const [needNotesUpdate, setNeedNotesUpdate] = useState(false)
    const [fetchNotes, {isLoading:notesLoading, data:notes}] = useLazyGetChapterNotesQuery()
    const [fetchDocfiles, {isLoading:docfilesLoading, data:docfiles}] = useLazyGetDocfilesQuery()    
    const getDocfiles = (project_id: number, chapter_id: number) => {
        if(!docfilesVisible){
            fetchDocfiles([project_id, chapter_id])
        }
        setDocfilesVisible (prev => !prev)
    }

    const getNotes = (project_id: number, chapter_id: number) => {
        if(!notesVisible){
            fetchNotes([project_id, chapter_id])
        }
        setNotesVisible (prev => !prev)
    }

    useEffect(() => {
        if(needNotesUpdate){
            setTimeout(() => {
                fetchNotes([project.id, chapter.id])
            }, 100);
            setNeedNotesUpdate(false)
        }
      }, [needNotesUpdate, fetchNotes, project.id, chapter.id, notes]);


    return (
        <>
        <div className="chapter w-full mb-2 p-2 border">
        <div 
            className="w-full flex my-1 items-center justify-between"
        >
            <h4 className="w-full">{chapter.title}</h4>
            <div className='chapters_buttons p-2 w-full flex justify-end'>
                <div className="p-1 hover:shadow shadow-2xl mr-1 ">
                    <span 
                        className='text-xs mb-1 cursor-pointer'
                        onClick={() => getDocfiles(project.id, chapter.id)}
                    >Документы</span>
                </div>
                <div className='p-1 hover:shadow shadow-2xl mr-1'>
                    <span 
                        className='text-xs mb-1 cursor-pointer'
                        onClick={() => getNotes(project.id, chapter.id)}
                    >Заметки</span>
                </div>
                <div className='p-1 hover:shadow shadow-2xl mr-1 '>
                    <span 
                        className='text-xs mb-1 cursor-pointer'
                        onClick={() => setNoteFormVisible( prev => !prev)}
                    >Добавить заметку</span>
                </div>
            </div>
        </div>
        {noteFormVisible && <NoteForm parent={{'chapter_id':chapter.id}} updateNotes={setNeedNotesUpdate} setNoteFormVisible={setNoteFormVisible}/>}
        {notesVisible && 
        <ul className='overflow-y-scroll max-h-[400px] overflow-hidden px-1 border'>
        {notes?.map(note => 
        <li key={note.id}>
            <Note note={note} project={project} updateNotes={setNeedNotesUpdate}/>
        </li>
        )}
        </ul>
        }
        {docfilesVisible && 
        <ul className='overflow-y-scroll mb-2 max-h-[500px] overflow-hidden p-1 border'>
        {docfiles?.map(docfile => 
        <li key={docfile.id}><Docfile project={project} docfile={docfile} /></li>
        )}
        </ul>
        }
        </div>
        

        {(docfilesLoading || notesLoading) &&  <div className="flex w-full justify-center"><Downloading/></div>}
        </>
       
    )
}
