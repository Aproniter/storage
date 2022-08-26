import { Project } from "../components/Project";
import { useProjects } from '../hooks/project';

interface HomeProps {
    auth: boolean
}

export function HomePage(props:HomeProps){

    const { projects } = useProjects()

    return(
    
    <>
        {!props.auth && <div className='flex justify-center text-rose-700 text-4xl'><p>Пожалуйста авторизуйтесь</p></div>}
        {projects.length > 0
        && props.auth 
        &&<div className='container flex justify-center my-5 mx-auto max-w-7xl'>
          {projects.map(project => <Project project={project} key={project.id}/>)}
        </div>
        }
        {projects.length === 0 && props.auth && <div className='flex justify-center text-rose-500 text-4xl'><p>Нет доступных проектов</p></div>}
    </>
    )
}