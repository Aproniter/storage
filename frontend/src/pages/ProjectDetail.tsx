import React from 'react';
import { useParams } from 'react-router-dom'

export function ProjectDetailPage() {
    const params = useParams<'id'>()

    return(
        <>        
        <div className='container'>ProjectDetail {params.id}</div>
        </>
    )
}