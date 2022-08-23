import React from 'react';
import { Project } from './components/Project';
import { useProjects } from './hooks/project';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const { projects } = useProjects()
  return (
   <>
   <div className='container flex justify-center my-5 mx-auto max-w-7xl'>
      {projects.map(project => <Project project={project} key={project.id}/>)}
    </div>
   </>
  );
}

export default App;
