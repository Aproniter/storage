import { Project } from "../components/Project";
import { serverApi, useGetProjectsQuery } from "../store/server/server.api";
import { IProject } from '../models';
import { Downloading } from "../components/Downloading";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { authSlice } from "../store/slices/authSlice";



export function HomePage(){
    const {isLoading, data: projectsData} = useGetProjectsQuery('')
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const navigate = useNavigate();
    const { error } = useSelector(serverApi.endpoints.getProjects.select(''))
    const [errMsg, setErrMsg] = useState('')
    const [projects, setProjects] = useState([])


    useEffect(() => {
      if(errMsg && isAuth){
        setErrMsg('')
      }
      if(!isAuth){
        navigate('/auth', { replace: false });
      }
    }, [isAuth, errMsg, navigate]);

    useEffect(() => {
      if(projectsData){
        setProjects(projectsData.results.items)
      }
    }, [projectsData]);

    useEffect(() => {
      if(error){
        if('status' in error) {
          if(error.status === 401){
            if('Недопустимый токен.' === error.data.detail){
              setErrMsg('Ошибка авторизации. Возможно сессия истекла')
            }
          }
        }
      }
    }, [error]);



    return(
      <>
      {errMsg && <div className=" text-center flex flex-col">
                    <div className="container bg-red-300 mx-auto mt-40 flex flex-col h-full w-full items-center justify-center">
                      {errMsg}
                    </div>
                    <span 
                          className="mt-[30px] p-2 rounded-lg w-[200px] mx-auto cursor-pointer bg-green-400"
                          onClick={() => dispatch(authSlice.actions.signout())}
                      >
                          <Link to='/auth'>Войти заново</Link>
                      </span>
                    </div>
          }
          {isLoading && <div className="flex w-full justify-center"><Downloading/></div>}
          {projects && projects.length > 0 && <div className='container flex justify-center my-5 mx-auto max-w-7xl'>
            {projects.map((project: IProject) => <Project project={project} key={project.id}/>)}
          </div>}
      </>
      )
}