import saveAs from "file-saver"
import { useEffect, useState } from "react"
import axios from "../axios"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { IChapter } from "../models"
import { fetchDocfiles } from "../store/actions/docfileActions"
import { Downloading } from "./Downloading"


interface ChapterCardProps {
    project_id: number
    chapter: IChapter
}

export function ChapterCard({ project_id, chapter }:ChapterCardProps) {
    const dispatch = useAppDispatch()
    const {error, loading, total_count, chapter_id, docfiles} = useAppSelector(state => state.docfile)
    const [docfilesVisible, setDocfilesVisible] = useState(false)
    const [chapterClasses, setchapterClasses] = useState(["card"])

    const chapterCardClickHandler = () => {
        if(!docfilesVisible){
            dispatch(fetchDocfiles(project_id, chapter.id))
        }
        setDocfilesVisible(prev => !prev)
    }

    async function getDocumentFile(docfile_id: number, filename: string) {
        await axios.get(
            `${process.env.REACT_APP_BASE_URL}projects/${project_id}/get_file/?docfile=${docfile_id}`, 
            {
                responseType: 'blob',
                // headers: {
                //     'authorization': `Token ${1}`
                // }
            })
            .then(response => new Blob([response.data]))
            .then(blob => saveAs(blob, filename))
            .catch((response) => {
                if(response.response.status === 404){
                    alert("Файл отсутствует.")
                } else {
                    console.error(response.message)
                }
        });
    };

    useEffect(() => {
        if(docfilesVisible){
            setchapterClasses(["card", "active-card"])
        } else {
            setchapterClasses(["card"])
        }
    }, [docfilesVisible, setchapterClasses])

    return(
        <div 
            className={chapterClasses.join(' ')}
        >
            {loading && <Downloading/>}
            <p className="card-title" onClick={chapterCardClickHandler}>{chapter.title}</p>
            {error && <p className="error-block">{error}</p>}
            {docfilesVisible && (chapter.id === chapter_id) && 
            <table className="card-list">
                <thead className="card-table-header">
                    <tr>
                        <th className="card-table-title">Имя файла</th>
                        <th className="card-table-data">Дата обновления</th>
                        <th className="card-table-tools"></th>
                    </tr>
                </thead>
                <tbody>
                    {docfiles.map(
                        docfile => 
                        <tr className="card-list-item" key={docfile.id}>
                            <td className="card-table-title">{docfile.title}</td>
                            <td className="card-table-data">{docfile.updated_at}</td>
                            <td className="card-table-tools">
                                <span className="card-table-tool">Заметки</span>
                                <span className="card-table-tool">Добавить заметку</span>
                                <span className="card-table-tool">Предпросмотр</span>
                                <span 
                                    className="card-table-tool"
                                    onClick={() => getDocumentFile(docfile.id, docfile.title)}
                                >Скачать</span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            }
        </div>
    )
}