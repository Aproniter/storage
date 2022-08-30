import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { ActivatePage } from './pages/ActivatePage';



function App() {
  
  return (
  <>
    <Nav />
    <Routes>
      <Route path='/' element={ <HomePage />}/>
      <Route path='/auth' element={ <AuthPage/>}/>
      <Route path='/activate' element={ <ActivatePage/>}/>
    </Routes>
  </>
   

  );
}

export default App;
