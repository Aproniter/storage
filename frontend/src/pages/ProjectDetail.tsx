import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { ChapterCard } from '../components/ChapterCard';
import { Downloading } from '../components/Downloading';
import { Pagination } from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchChapters } from '../store/actions/chapterActions';

export function ProjectDetailPage() {
    const project_id = Number(useParams<'id'>().id)
    const dispatch = useAppDispatch()
    const {error, loading, total_count, chapters} = useAppSelector(state => state.chapter)
    const [page, setPage] = useState(1)

    const pageCount = Math.ceil(total_count / 5)

    useEffect(() => {
        dispatch(fetchChapters(page, project_id))
    }, [dispatch, page, project_id])

    return(
        <div className="container">
            {loading && <Downloading/>}
            {error && <p className="error-block">{error}</p>}
            {<Pagination pageCount={pageCount} setPage={setPage}/>}
            {chapters.map(
                    chapter => 
                    <ChapterCard key={chapter.id} chapter={chapter} project_id={project_id}/>
            )}
        </div>
    )
}