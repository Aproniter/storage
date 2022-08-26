import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';



function App() {

  const [auth, setAuth] = useState(window.localStorage.getItem('auth') === 'true')


  function handler(status:boolean){
    setAuth(status)
  }
  
  return (
  <>
    <Nav handler={handler} auth={auth}/>
    <Routes>
      <Route path='/' element={ <HomePage auth/>}/>
      <Route path='/signup' element={ <RegistrationPage/>}/>
      <Route path='/login' element={ <LoginPage/>}/>
    </Routes>
  </>
   

  );
}

export default App;
