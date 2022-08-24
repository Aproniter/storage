import axios from "axios";
import React, { useState } from "react";


const BaseURL = process.env.REACT_APP_BASE_URL;


const headers = {
    'content-type': 'application/json',
}

interface NavProps {
    handler: ()=>void;
    auth: boolean;
}

export function Nav(props:NavProps) {
    const [email_value, setEmail] = useState('')
    const [password_value, setPassword] = useState('')
    let auth = props.auth

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
            setEmail('');
            setPassword('');
            auth = true
            props.handler()
        }
    }

    async function logout() {
        const token = window.localStorage.getItem('token')
        try {
            await axios({
                method: 'post',
                url: `${BaseURL}/logout/`,
                headers: {
                    ...headers,
                    'authorization': `Token ${token}`
                },
            });
        } catch {} finally {
            window.localStorage.removeItem('token');
            setEmail('');
            setPassword('');
            auth = false
            props.handler()
        };
        
    };

    return (
        <>
            <nav className="nav flex justify-between my-5 mx-auto max-w-7xl">
                <p>Лого</p>
                {
                    auth ? 
                    <button 
                        className="logout p-1 outline outline-offset-2 outline-1 rounded-sm"
                        onClick={() => logout()}
                    >
                        Выйти
                    </button>
                    :
                    <form className="login_form flex p-2" onSubmit={submitHandler}>
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
                }
            </nav>
        </>
    )
}