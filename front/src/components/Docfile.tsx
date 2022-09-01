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


interface DocfileProps {
    docfile: IDocfile
    project: IProject
}

export function Docfile({project, docfile}: DocfileProps) {
    const haveNotes = (docfile.notes && docfile.notes.length > 0);
    const [images, setImages] = useState<IImage[]>([]);
    const [imagesVisible, setImagesVisible] = useState(false);
    const [notesVisible, setNotesVisible] = useState(false);
    const token = useAppSelector(state => state.auth.token);
    const [fetchNotes, {isLoading:notesLoading, data:notes}] = useLazyGetDocfileNotesQuery()
    const [fetchPreview, {isLoading:imagesLoading, data:fetcImages}] = useLazyGetPreviewQuery()

    useEffect(() => {
        setImages(fetcImages ? fetcImages : [])
      }, [fetcImages]);

    const getNotes = (project_id: number, chapter_id: number) => {
        if(!notesVisible && haveNotes){
            fetchNotes([project_id, chapter_id])
        }
        setNotesVisible (prev => !prev)
    }

    const getPreview = (project_id: number, chapter_id: number) => {
        if(!imagesVisible && images.length === 0){
            fetchPreview([project_id, chapter_id])
        }
        setImagesVisible (prev => !prev)
    }

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
            className="docfile px-2 w-full flex my-1 items-center border-b"
        >
            <h4 className="w-full">{docfile.title}</h4>
            <div className='tools flex'>
                <div className="tool p-1 hover:shadow shadow-2xl items-center flex flex-col" data-tooltip='Предпросмотр'>
                    <span className='text-xs mb-1'>предпросмотр</span>
                    <svg
                        className='w-8 h-8'
                        onClick={() => getPreview(project.id, docfile.id)}
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><g id="_01_align_center" data-name="01 align center"><path d="M24,22.586l-6.262-6.262a10.016,10.016,0,1,0-1.414,1.414L22.586,24ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"/></g>
                    </svg>
                </div>
                {haveNotes && <div data-tooltip='Показать/скрыть' className='p-1 hover:shadow shadow-2xl items-center flex flex-col'>
                    <span className='text-xs mb-1'>заметки</span>
                    <svg
                        className="w-8 h-8 fill-red-500"
                        onClick={() => getNotes(project.id, docfile.id)}
                        xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M20,0H4A4,4,0,0,0,0,4V16a4,4,0,0,0,4,4H6.9l4.451,3.763a1,1,0,0,0,1.292,0L17.1,20H20a4,4,0,0,0,4-4V4A4,4,0,0,0,20,0Zm2,16a2,2,0,0,1-2,2H17.1a2,2,0,0,0-1.291.473L12,21.69,8.193,18.473h0A2,2,0,0,0,6.9,18H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H20a2,2,0,0,1,2,2Z"/><path d="M7,7h5a1,1,0,0,0,0-2H7A1,1,0,0,0,7,7Z"/><path d="M17,9H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/><path d="M17,13H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/>
                    </svg>
                </div>}
                <div className="tool p-1 hover:shadow shadow-2xl items-center flex flex-col" data-tooltip='Скачать документ'>
                    <span className='text-xs mb-1'>скачать</span>
                    <svg 
                        className='w-8 h-8'
                        onClick={() => getDocumentFile(docfile.id, docfile.title)}
                        xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M9.878,18.122a3,3,0,0,0,4.244,0l3.211-3.211A1,1,0,0,0,15.919,13.5l-2.926,2.927L13,1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1l-.009,15.408L8.081,13.5a1,1,0,0,0-1.414,1.415Z"/><path d="M23,16h0a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V17a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1v4a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V17A1,1,0,0,0,23,16Z"/>
                    </svg>
                </div>
            </div>
        </div>
        {notesVisible && <div className='notes m-2'>{notes?.map(note => <Note note={note} key={note.id}/>)}</div>}
        {(imagesLoading || notesLoading) &&  <div className="flex w-full justify-center"><Downloading/></div>}
        {imagesVisible && images && images.length > 0 && <Slider {...settings}>
                            {[...images].sort((a,b) => a.id - b.id).map((image) => (
                                <Image path={image.path} id={image.id} key={image.id}/>
                            ))}
                          </Slider>}
        </>
    )
}