import { useState } from 'react';
import { Project } from './components/Project';
import { Nav } from './components/Nav';
import { useProjects } from './hooks/project';


function App() {
  const { projects } = useProjects()
  const [auth, setAuth] = useState(window.localStorage.getItem('auth') === 'true')


  function handler(status:boolean){
    setAuth(status)
  }
  
  return (
  <>
    <Nav handler={handler} auth={auth}/>
    {!auth && <div className='flex justify-center text-rose-700 text-4xl'><p>Пожалуйста авторизуйтесь</p></div>}
    {projects.length > 0
      && auth 
      &&<div className='container flex justify-center my-5 mx-auto max-w-7xl'>
          {projects.map(project => <Project project={project} key={project.id}/>)}
        </div>
      }
    {projects.length === 0 && auth && <div className='flex justify-center text-rose-500 text-4xl'><p>Нет доступных проектов</p></div>}
  </>
   

  );
}

export default App;
