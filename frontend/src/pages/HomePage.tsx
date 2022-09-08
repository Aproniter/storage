import { ProjectCard } from "../components/ProjectCard";
import { ProjectSearch } from "../components/ProjectSearch";
import { useEffect, useState } from "react";
import { fetchProjects } from "../store/actions/projectActions";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Downloading } from "../components/Downloading";
import { Pagination } from "../components/Pagination";


export function HomePage(){
    const dispatch = useAppDispatch()
    const {error, loading, total_count, projects} = useAppSelector(state => state.project)
    const [page, setPage] = useState(1)

    const pageCount = Math.ceil(total_count / 5)

    useEffect(() => {
        dispatch(fetchProjects(page))
    }, [dispatch, page])


    return(
        <div className="container">
            <ProjectSearch/>
            {loading && <Downloading/>}
            {error && <p className="error-block">{error}</p>}
            {<Pagination pageCount={pageCount} setPage={setPage}/>}
            {projects.map(
                    project => 
                    <ProjectCard key={project.id} project={project}/>
            )}
        </div>
    )
}