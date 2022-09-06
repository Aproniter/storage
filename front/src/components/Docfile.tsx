import axios from "axios"
import { useEffect, useState } from "react"
import { saveAs } from 'file-saver'
import { IDocfile, IImage, IProject, } from "../models"
import { Image } from './Image'
import { Downloading } from './Downloading'
import { settings } from '../components-settings/slider-settings'
import Slider from 'react-slick'
import { Note } from "./Note"
import { useLazyGetDocfileNotesQuery, useLazyGetPreviewQuery } from "../store/server/server.api"
import { useAppSelector } from "../hooks/redux"
import { NoteForm } from "./NoteForm"


interface DocfileProps {
    docfile: IDocfile
    project: IProject
}

export function Docfile({project, docfile}: DocfileProps) {
    const [images, setImages] = useState<IImage[]>([]);
    const [imagesVisible, setImagesVisible] = useState(false);
    const [notesVisible, setNotesVisible] = useState(false);
    const token = useAppSelector(state => state.auth.token);
    const [fetchNotes, {isLoading:notesLoading, data:notes}] = useLazyGetDocfileNotesQuery()
    const [fetchPreview, {isLoading:imagesLoading, data:fetcImages}] = useLazyGetPreviewQuery()
    const [noteFormVisible, setNoteFormVisible] = useState(false)
    const [needNotesUpdate, setNeedNotesUpdate] = useState(false)

    useEffect(() => {
        setImages(fetcImages ? fetcImages : [])
      }, [fetcImages]);

    const getNotes = (project_id: number, docfile_id: number) => {
        if(!notesVisible){
            fetchNotes([project_id, docfile_id])
        }
        setNotesVisible (prev => !prev)
    }

    const getPreview = (project_id: number, chapter_id: number) => {
        if(!imagesVisible && images.length === 0){
            fetchPreview([project_id, chapter_id])
        }
        setImagesVisible (prev => !prev)
    }

    useEffect(() => {
        if(needNotesUpdate){
            setTimeout(() => {
                fetchNotes([project.id, docfile.id])
            }, 100);
            setNeedNotesUpdate(false)
        }
      }, [needNotesUpdate, fetchNotes, project.id, docfile.id, notes]);

    async function getDocumentFile(docfile_id: number, filename: string) {
        return axios.get(
            `${process.env.REACT_APP_BASE_URL}projects/${project.id}/get_file/?docfile=${docfile_id}`, 
            {
                responseType: 'blob',
                headers: {
                    'authorization': `Token ${token}`
                }
            })
        .then(response => new Blob([response.data]))
        .then(blob => saveAs(blob, filename))
    };

    return (
        <>
        <div 
            className="w-full flex flex-col border-b"
        >
            <div className="docfile px-2 w-full flex my-1 items-center ">
                <h4 className="w-full">{docfile.title}</h4>
                <p className="w-full">{docfile.updated_at}</p>
                <div className='docfiles_buttons p-2 w-full flex justify-end'>
                    <div className="p-1 hover:shadow shadow-2xl mr-1 ">
                        <span 
                            className='text-xs mb-1 cursor-pointer'
                            onClick={() => getPreview(project.id, docfile.id)}
                        >Предпросмотр</span>
                    </div>
                    <div className="p-1 hover:shadow shadow-2xl mr-1 ">
                        <span 
                            className='text-xs mb-1 cursor-pointer'
                            onClick={() => getDocumentFile(docfile.id, docfile.title)}
                        >Скачать</span>
                    </div>
                    <div className='p-1 hover:shadow shadow-2xl mr-1 '>
                        <span 
                            className='text-xs mb-1 cursor-pointer'
                            onClick={() => getNotes(project.id, docfile.id)}
                        >Заметки</span>
                    </div>
                    <div className='p-1 hover:shadow shadow-2xl mr-1 '>
                        <span 
                            className='text-xs mb-1 cursor-pointer w-full'
                            onClick={() => setNoteFormVisible( prev => !prev)}
                        >Добавить заметку</span>
                    </div>
                </div>
            </div>
            <div className="px-2 w-full my-1 ">
            {noteFormVisible && <NoteForm parent={{'docfile_id':docfile.id}} updateNotes={setNeedNotesUpdate} setNoteFormVisible={setNoteFormVisible}/>}
            {notesVisible &&
                <ul className='overflow-y-scroll max-h-[400px] overflow-hidden p-1'>
                {notes?.map(note => 
                <li key={note.id}>
                    <Note note={note} project={project} updateNotes={setNeedNotesUpdate}/>
                </li>
                )}
                </ul>
                }
                {(imagesLoading || notesLoading) &&  <div className="flex w-full justify-center"><Downloading/></div>}
                {imagesVisible && images && images.length > 0 && <Slider {...settings}>
                                {[...images].sort((a,b) => a.id - b.id).map((image) => (
                                    <Image path={image.path} id={image.id} key={image.id}/>
                                ))}
                            </Slider>}
            </div>
           
            
        </div>
       
        </>
    )
}