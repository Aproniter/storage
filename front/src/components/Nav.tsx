import axios from "axios";
import { Link, useNavigate, } from "react-router-dom";
import { headers } from "../components-settings/headers";


const BaseURL = process.env.REACT_APP_BASE_URL;

interface NavProps {
    handler: (status:boolean)=>void;
    auth: boolean;
}

export function Nav(props:NavProps) {
    let auth = props.auth
    let navigate = useNavigate();
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
            window.localStorage.removeItem('auth');
            auth = false
            props.handler(false)
            navigate('/', { replace: false });
        };
        
    };

    return (
        <>
            <nav className="nav flex justify-between my-5 mx-auto max-w-7xl">
                <Link to='/'>Лого</Link>
                {
                    auth ? 
                    <button 
                        className="logout p-1 outline outline-offset-2 outline-1 rounded-sm"
                        onClick={() => logout()}
                    >
                        Выйти
                    </button>
                    :
                    <div>
                        <span 
                            className="logout p-1 mr-3 outline outline-offset-2 outline-1 rounded-sm"
                        >
                            <Link to='/login'>Войти</Link>
                        </span>
                        <span 
                            className="signup p-1 outline outline-offset-2 outline-1 rounded-sm"
                        >
                            <Link to='/signup'>Регистрация</Link>
                        </span>
                    </div>
                }
            </nav>
        </>
    )
}