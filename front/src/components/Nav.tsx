import axios from "axios";
import { Link, useNavigate, } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { authSlice } from "../store/slices/authSlice";

export function Nav() {
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const token = useAppSelector(state => state.auth.token);
    
    const signoutHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        axios.post(
            `${process.env.REACT_APP_BASE_URL}logout/`, 
            {
                headers: {
                    'authorization': `Token ${token}`
                }
            });
        dispatch(authSlice.actions.signout());
        navigate('/', { replace: false });
    }

    return (
        <>
            <nav className="nav flex justify-between my-5 mx-auto max-w-7xl">
            {isAuth ? <Link to='/'>Лого</Link> : 'Лого'}
                {
                    isAuth ? 
                    <button 
                        className="logout p-1 outline outline-offset-2 outline-1 rounded-sm"
                        onClick={signoutHandler}
                    >
                        Выйти
                    </button>
                    :
                    <div>
                        <span 
                            className="logout p-1 mr-3 outline outline-offset-2 outline-1 rounded-sm"
                        >
                            <Link to='/auth'>Вход/Регистрация</Link>
                        </span>
                    </div>
                }
            </nav>
        </>
    )
}