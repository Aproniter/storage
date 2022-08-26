import axios from "axios"
import { useState } from "react"
import { saveAs } from 'file-saver'
import { IChapter, IDocfile, IImage, INote, IProject, } from "../models"
import { Image } from './Image'
import { Downloading } from './Downloading'
import { settings } from '../components-settings/slider-settings'
import Slider from 'react-slick'
import { Note } from "./Note"


interface DocfileProps {
    docfile: IDocfile
    project: IProject
}

const headers = {
    'content-type': 'application/json',
}

const BaseURL = process.env.REACT_APP_BASE_URL


export function Docfile({project, docfile}: DocfileProps) {
    const haveNotes = (docfile.notes && docfile.notes.length > 0);
    const iconColorClassName = haveNotes ? 'fill-red-500' : 'fill-grey-500';
    const iconClasses = ["w-8 h-8", iconColorClassName];
    const [images, setImages] = useState<IImage[]>([]);
    const [imagesVisible, setImagesVisible] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [notes, setNotes] = useState<INote[]>([]);
    const [notesVisible, setNotesVisible] = useState(false);

    async function fetchNotes(ids: INote[] | undefined) {
        if(notes.length === 0){
            if(ids){
                const token = window.localStorage.getItem('token')
                const params = ids.join(',')
                const responce = await axios.get<INote[]>(
                    `${BaseURL}/notes/?ids=${params}`,
                    { headers: {
                            ...headers, 
                            'authorization': `Token ${token}`
                    }}
                )
                setNotes(responce.data)
            }
        }
        setNotesVisible (prev => !prev)
    };

    async function fetchPreview() {
        setDownloading(true)
        if(images.length === 0){
            const token = window.localStorage.getItem('token')
            const responce = await axios.get<IImage[]>(
                `${BaseURL}/projects/${project.id}/get_preview/?docfile=${docfile.id}`,
                { headers: {
                    ...headers, 
                    'authorization': `Token ${token}`
            }}
            )
            if(responce.data.length === 0){
                setDownloading(false)
                return
            }
            setImages(responce.data)
        }
        setImagesVisible (prev => !prev)
        setDownloading(false)
    };

    async function getDocumentFile(docfile_id: number, filename: string) {
        const token = window.localStorage.getItem('token')
        return axios.get(
            `${BaseURL}/projects/${project.id}/get_file/?docfile=${docfile.id}`, 
            {
                responseType: 'blob',
                headers: {
                    ...headers, 
                    'authorization': `Token ${token}`
                }
            })
        .then(response => new Blob([response.data]))
        .then(blob => saveAs(blob, filename))
    };

    return (
        <>
        <div 
            className="chapter w-full flex my-10 items-center border-b"
        >
            <h4 className="w-full">{docfile.title}</h4>
            <div className='tools flex'>
                <div className="tool p-1 hover:shadow shadow-2xl" data-tooltip='Предпросмотр'>
                    <svg
                        className='w-8 h-8'
                        onClick={() => fetchPreview()}
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><g id="_01_align_center" data-name="01 align center"><path d="M24,22.586l-6.262-6.262a10.016,10.016,0,1,0-1.414,1.414L22.586,24ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"/></g>
                    </svg>
                </div>
                <div className="tool p-1 hover:shadow shadow-2xl" data-tooltip='Показать/скрыть заметки'>
                    <svg
                        className={iconClasses.join(' ')}
                        onClick={haveNotes ? () => fetchNotes(docfile.notes) : () => false}
                        xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M20,0H4A4,4,0,0,0,0,4V16a4,4,0,0,0,4,4H6.9l4.451,3.763a1,1,0,0,0,1.292,0L17.1,20H20a4,4,0,0,0,4-4V4A4,4,0,0,0,20,0Zm2,16a2,2,0,0,1-2,2H17.1a2,2,0,0,0-1.291.473L12,21.69,8.193,18.473h0A2,2,0,0,0,6.9,18H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H20a2,2,0,0,1,2,2Z"/><path d="M7,7h5a1,1,0,0,0,0-2H7A1,1,0,0,0,7,7Z"/><path d="M17,9H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/><path d="M17,13H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/>
                    </svg>
                </div>
                <div className="tool p-1 hover:shadow shadow-2xl" data-tooltip='Скачать документ'>
                    <svg 
                        className='w-8 h-8'
                        onClick={() => getDocumentFile(docfile.id, docfile.title)}
                        xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M9.878,18.122a3,3,0,0,0,4.244,0l3.211-3.211A1,1,0,0,0,15.919,13.5l-2.926,2.927L13,1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1l-.009,15.408L8.081,13.5a1,1,0,0,0-1.414,1.415Z"/><path d="M23,16h0a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V17a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1v4a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V17A1,1,0,0,0,23,16Z"/>
                    </svg>
                </div>
            </div>
        </div>
        {notesVisible && notes.map(note => <Note note={note} key={note.id}/>)}
        {downloading && <Downloading/>}
        {imagesVisible && <Slider {...settings}>
                            {images.sort((a,b) => a.id - b.id).map((image) => (
                                <Image data={image.data} id={image.id} key={image.id}/>
                            ))}
                          </Slider>}
        </>
    )
}
