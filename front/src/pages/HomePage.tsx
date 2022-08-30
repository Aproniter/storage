import { Project } from "../components/Project";
import { useGetProjectsQuery } from "../store/server/server.api";
import { IProject } from '../models';
import { Downloading } from "../components/Downloading";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { useEffect } from "react";



export function HomePage(){
    const {isLoading, data: projects} = useGetProjectsQuery('')
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const navigate = useNavigate();

    useEffect(() => {
      if(!isAuth){
        navigate('/auth', { replace: false });
      }
    });

    return(
      <>
          { isLoading && <div className="flex w-full justify-center"><Downloading/></div>}
          {projects && projects.length > 0 && <div className='container flex justify-center my-5 mx-auto max-w-7xl'>
            {projects.map((project: IProject) => <Project project={project} key={project.id}/>)}
          </div>}
      </>
      )

   
}