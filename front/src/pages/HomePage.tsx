import { Project } from "../components/Project";
import { serverApi, useLazyGetProjectsQuery } from "../store/server/server.api";
import { IProject } from '../models';
import { Downloading } from "../components/Downloading";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { authSlice } from "../store/slices/authSlice";
import { Pagination } from "../components/Pagination";



export function HomePage(){
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const navigate = useNavigate();
    const { error } = useSelector(serverApi.endpoints.getProjects.select(1))
    const [errMsg, setErrMsg] = useState('')
    const [projects, setProjects] = useState([])
    const [nextPage, setNextPage] = useState(false)
    const [prevPage, setPrevPage] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)

    const [fetchProjects, {isLoading, data: projectsData}] = useLazyGetProjectsQuery()

    useEffect(() => {
      if(isAuth){
        setErrMsg('')
      }
      if(!isAuth){
        navigate('/auth', { replace: false });
      }
    }, [isAuth, navigate]);

    function pages(){
      let pages:number[] = []
      for(let i =1; i <= totalPages; i++){
          pages.push(i)
      }
      return pages
  }

    useEffect(() => {
      fetchProjects(page)
    }, [fetchProjects, page]);

  useEffect(() => {
      if(projectsData){
        setProjects(projectsData.results.items)
          if(projectsData.links){
              if(projectsData.links.next){
                  setNextPage(true)
              }
              if(projectsData.links.previous){
                  setPrevPage(true)
              }
          }
          if(projectsData.total_count){
              setTotalPages(Math.ceil(projectsData.total_count / 5))
          }
      }
    }, [projectsData]);

    useEffect(() => {
      
      if(error){
        if('status' in error) {
          if(error.status === 401){
            if('Недопустимый токен.' === error.data.detail){
              setErrMsg('Ошибка авторизации. Возможно сессия истекла')
            } else {
              setErrMsg(error.data.detail)
            }
          }
        } else {
          setErrMsg('')
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
          {(nextPage || prevPage) && <Pagination pageNumber={page} pages={pages()} setPage={setPage}/>}
          {projects && projects.length > 0 && <div className='container flex flex-col justify-center my-5 mx-auto max-w-7xl'>
            {projects.map((project: IProject) => <Project project={project} key={project.id}/>)}
          </div>}
      </>
      )
}