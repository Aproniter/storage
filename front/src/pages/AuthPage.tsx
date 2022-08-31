import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { signin } from "../store/actions/authActions";

export function AuthPage(){
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const [errorMessage, setErrorMessage] = useState('')
    const [email_value, setEmail] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [password_value, setPassword] = useState('')
    const [signup, setSignup] = useState(false)
    const dispatch = useAppDispatch()
    const authBtnClasses = ['p-2 rounded-lg bg-gray-200','p-2 rounded-lg cursor-pointer bg-green-400']
    const navigate = useNavigate();
    const isFormValid = () => email_value && password_value

    const signupHendler = (status:boolean) => {
        setSignup(status)
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
    }

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault()
        if (isFormValid()){
            try{
                await dispatch(signin({
                    email: email_value, 
                    password: password_value,
                    first_name: first_name, 
                    last_name: last_name, 
                    username: username, 
                }))
                navigate('/', { replace: false });
            } catch (e:any){
                if(e.response.data.detail){
                    setErrorMessage(e.response.data.detail)
                } else if(e.response.data.email){
                    setErrorMessage(e.response.data.email)
                } else{
                    setErrorMessage(e.response.data)
                }
                
            }
            
        } else {
            alert('Заполните данные')
        }
        
    }

    if(isAuth){
        navigate('/', { replace: false });
    }

    return(
        <>
        {errorMessage && 
        <div className="container bg-red-300 mx-auto mt-40 flex flex-col h-full w-full items-center justify-center">
            {errorMessage}
        </div>
        }
        <div className="container mx-auto mt-40 flex flex-col h-full w-full items-center justify-center">
            <span>
                <span
                    className={!signup ? authBtnClasses[0] : authBtnClasses[1]}
                    onClick={signup ? () => signupHendler(false) : () => false}
                >Войдите</span> или <span
                    className={signup ? authBtnClasses[0] : authBtnClasses[1]}
                    onClick={!signup ? () => signupHendler(true) : () => false}
                >зарегестрируйтесь</span>
            </span>
            {(!signup &&
                <form className="login_form flex flex-col p-2" onSubmit={submitHandler}>
                    <input 
                        className="login_email p-1 my-2 outline outline-offset-2 outline-1 rounded-sm" 
                        type="text"
                        placeholder="Email"
                        value={email_value}
                        onChange={event => setEmail(event.target.value)}
                    ></input>
                    <input 
                        className="login_password p-1 my-2 outline outline-offset-2 outline-1 rounded-sm" 
                        type="password"
                        placeholder="Пароль"
                        value={password_value}
                        onChange={event => setPassword(event.target.value)}
                    ></input>
                    <button className="login p-1 outline my-2 outline-offset-2 outline-1 rounded-sm" type="submit">Войти</button>
                </form>)
            ||
                <form className="login_form flex flex-col p-2 " onSubmit={submitHandler}>
                    <input 
                        className="login_email p-1 my-2 outline outline-offset-2 outline-1 rounded-sm" 
                        type="text"
                        placeholder="Имя"
                        value={first_name}
                        onChange={event => setFirstName(event.target.value)}
                    ></input>
                    <input 
                        className="login_password p-1 my-2 outline outline-offset-2 outline-1 rounded-sm" 
                        type="text"
                        placeholder="Фамилия"
                        value={last_name}
                        onChange={event => setLastName(event.target.value)}
                    ></input>
                    <input 
                        className="login_password p-1 my-2 outline outline-offset-2 outline-1 rounded-sm" 
                        type="text"
                        placeholder="Email"
                        value={email_value}
                        onChange={event => setEmail(event.target.value)}
                    ></input>
                    <input 
                        className="login_password p-1 my-2 outline outline-offset-2 outline-1 rounded-sm" 
                        type="text"
                        placeholder="Логин"
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                    ></input>
                    <input 
                        className="login_password p-1 my-2 outline outline-offset-2 outline-1 rounded-sm" 
                        type="password"
                        placeholder="Пароль"
                        value={password_value}
                        onChange={event => setPassword(event.target.value)}
                    ></input>
                    <button className="login p-1 outline my-2 outline-offset-2 outline-1 rounded-sm" type="submit">Регистрация</button>
                </form>
            }
        </div>
        </>
    )
}