import { IProject } from "../models"
import { useNavigate } from'react-router-dom'


interface ProjectCardProps {
    project: IProject
}

export function ProjectCard({ project }:ProjectCardProps) {
    const navigate = useNavigate()

    const projectCardClickHandler = () => {
        navigate(`/project/${project.id}`)
    }

    return(
        <div 
            className="project-card"
            onClick={projectCardClickHandler}
        >
            <p className="project-title">{project.title}</p>
        </div>
    )
}