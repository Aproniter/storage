import { ProjectCard } from "../components/ProjectCard";
import { ProjectSearch } from "../components/ProjectSearch";
import { useEffect } from "react";
import { fetchProjects } from "../store/actions/projectActions";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Downloading } from "../components/Downloading";
import ReactPaginate from 'react-paginate';

export function HomePage(){
    const dispatch = useAppDispatch()
    const {error, loading, projects} = useAppSelector(state => state.project)

    useEffect(() => {
        dispatch(fetchProjects())
    }, [dispatch])

    const handlePageClick = ({selected}: {select:number}) => {
        console.log(event)
    }

    const pageCount = 2

    return(
        <div className="container">
            <ProjectSearch/>
            {loading && <Downloading/>}
            {error && <p className="error-block">{error}</p>}
            {projects.map(
                    project => 
                    <ProjectCard key={project.id} project={project}/>
            )}
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
            />
        </div>
    )
}