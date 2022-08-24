import { useState } from 'react';
import { Project } from './components/Project';
import { Nav } from './components/Nav';
import { useProjects } from './hooks/project';


function App() {
  const { projects } = useProjects()
  const [auth, setAuth] = useState(false)


  function handler(){
    setAuth(prev => !prev)
  }
  
  return (
  <>
    <Nav handler={handler} auth={auth}/>
    <div className='container flex justify-center my-5 mx-auto max-w-7xl'>
      {projects.map(project => <Project project={project} key={project.id}/>)}
    </div>
  </>
   

  );
}

export default App;
