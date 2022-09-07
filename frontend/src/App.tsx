import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetail';

function App() {
  return (
    <>
     <Navigation/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/project/:id' element={<ProjectDetailPage/>}/>
        <Route path='/auth' element={<AuthPage/>}/>
      </Routes>
    </>
  );
}

export default App;
