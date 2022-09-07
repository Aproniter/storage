import { Link } from 'react-router-dom'

export function Navigation() {
    return(
        <nav className="navigation">
            <Link to='/'>Главная</Link>
            <Link to='/auth'>Вход / Регистрация</Link>
        </nav>
    )
}