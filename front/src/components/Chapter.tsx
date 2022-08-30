import { useState } from 'react';
import { IChapter, IProject} from '../models';
import { Note } from './Note';
import { Docfile } from './Docfile';
import { useLazyGetChapterNotesQuery, useLazyGetDocfilesQuery } from '../store/server/server.api';
import { Downloading } from './Downloading';

interface ChapterProps {
    project: IProject
    chapter: IChapter
};

export function Chapter({ project, chapter }: ChapterProps) {
    const haveNotes = chapter.notes.length > 0;
    const iconColorClassName = haveNotes ? 'fill-red-500' : 'fill-grey-500';
    const iconClasses = ["w-8 h-8", iconColorClassName];
    const [notesVisible, setNotesVisible] = useState(false);
    const [docfilesVisible, setDocfilesVisible] = useState(false);

    const [fetchNotes, {isLoading:notesLoading, data:notes}] = useLazyGetChapterNotesQuery()
    const [fetchDocfiles, {isLoading:docfilesLoading, data:docfiles}] = useLazyGetDocfilesQuery()

    const getDocfiles = (project_id: number, chapter_id: number) => {
        if(!docfilesVisible){
            fetchDocfiles([project_id, chapter_id])
        }
        setDocfilesVisible (prev => !prev)
    }

    const getNotes = (project_id: number, chapter_id: number) => {
        if(!notesVisible && haveNotes){
            fetchNotes([project_id, chapter_id])
        }
        setNotesVisible (prev => !prev)
    }



    return (
        <>
         <div 
            className="chapter w-full flex my-10 items-center border-b"
        >
            <h4 className="w-full">{chapter.title}</h4>
            <div className='tools flex'>
                <div className="tool p-1 hover:shadow shadow-2xl" data-tooltip='Показать/скрыть документы'>
                <svg 
                    className='w-8 h-8'
                    onClick={() => getDocfiles(project.id, chapter.id)}
                    id="Layer_1" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m7 12h10v2h-10zm0 6h7v-2h-7zm15-10.414v16.414h-20v-21a3 3 0 0 1 3-3h9.414zm-7-.586h3.586l-3.586-3.586zm5 15v-13h-7v-7h-8a1 1 0 0 0 -1 1v19z"/></svg>
                </div>
                <div className="tool p-1 hover:shadow shadow-2xl" data-tooltip='Показать/скрыть заметки'>
                    <svg
                        className={iconClasses.join(' ')}
                        onClick={() => getNotes(project.id, chapter.id)}
                        xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M20,0H4A4,4,0,0,0,0,4V16a4,4,0,0,0,4,4H6.9l4.451,3.763a1,1,0,0,0,1.292,0L17.1,20H20a4,4,0,0,0,4-4V4A4,4,0,0,0,20,0Zm2,16a2,2,0,0,1-2,2H17.1a2,2,0,0,0-1.291.473L12,21.69,8.193,18.473h0A2,2,0,0,0,6.9,18H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H20a2,2,0,0,1,2,2Z"/><path d="M7,7h5a1,1,0,0,0,0-2H7A1,1,0,0,0,7,7Z"/><path d="M17,9H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/><path d="M17,13H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/>
                    </svg>
                </div>
            </div>
        </div>
        {notesVisible && notes?.map(note => <Note note={note} key={note.id}/>)}
        {docfilesVisible && docfiles?.map(docfile => <Docfile project={project} docfile={docfile} key={docfile.id}/>)}
        {(docfilesLoading || notesLoading) &&  <div className="flex w-full justify-center"><Downloading/></div>}
        </>
       
    )
}
