import { useEffect, useState } from "react"
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
                <tr className="card-table-header">
                    <td className="card-table-title">Имя файла</td>
                    <td className="card-table-data">Дата обновления</td>
                    <td className="card-table-tools"></td>
                </tr>
            {docfiles.map(
                    docfile => 
                    <tr className="card-list-item" key={docfile.id}>
                        <td className="card-table-title">{docfile.title}</td>
                        <td className="card-table-data">{docfile.updated_at}</td>
                        <td className="card-table-tools">
                            <span className="card-table-tool">Заметки</span>
                            <span className="card-table-tool">Добавить заметку</span>
                            <span className="card-table-tool">Предпросмотр</span>
                            <span className="card-table-tool">Скачать</span>
                        </td>
                    </tr>
            )}
            </table>
            }
        </div>
    )
}

{/* <span>Заметки</span>
<span>Добавить заметку</span>
<span>Предпросмотр</span>
<span>Скачать</span> */}