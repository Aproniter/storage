import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { headers } from "../components-settings/headers";

const BaseURL = process.env.REACT_APP_BASE_URL;

export function LoginPage(){
    const [email_value, setEmail] = useState('')
    const [password_value, setPassword] = useState('')
    let navigate = useNavigate();
    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault()
        
        const response = await axios({
            method: 'post',
            url: `${BaseURL}/login/`,
            headers: headers,
            data: {
                "email": email_value, 
                "password": password_value
            }
        });
        if(response.status === 200){
            window.localStorage.setItem(
                'token', 
                response.data.token
            );
            window.localStorage.setItem(
                'auth', 
                'true'
            );
            setEmail('');
            setPassword('');
            navigate('/', { replace: true });
        }
    }

    return(
        <div className="container mx-auto mt-40 flex h-full w-full items-center justify-center">
            <form className="login_form flex p-2 " onSubmit={submitHandler}>
                <input 
                    className="login_email p-1 mx-2 outline outline-offset-2 outline-1 rounded-sm" 
                    type="text"
                    placeholder="Email"
                    value={email_value}
                    onChange={event => setEmail(event.target.value)}
                ></input>
                <input 
                    className="login_password p-1 mx-2 outline outline-offset-2 outline-1 rounded-sm" 
                    type="password"
                    placeholder="Пароль"
                    value={password_value}
                    onChange={event => setPassword(event.target.value)}
                ></input>
                <button className="login p-1 outline mx-2 outline-offset-2 outline-1 rounded-sm" type="submit">Войти</button>
            </form>
        </div>
    )
}