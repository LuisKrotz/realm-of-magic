import { useNavigate, useLocation, Link } from "react-router-dom";

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const logout = () => {
        sessionStorage.removeItem(global.config.tokens.authToken)

        navigate(global.config.routes.login)
    }

    return (
        <nav className="nav">
            {<Link className='nav-logo'
                to={global.config.routes.list}>
                Magic
            </Link>}

            <div>
                {(location.pathname === global.config.routes.create) && <Link className='nav-link'
                                                                            to={global.config.routes.list}>
                                                                            List
                                                                        </Link>}

                {(location.pathname === global.config.routes.list) && <Link className='nav-link'
                                                                            to={global.config.routes.create}>
                                                                        Create
                                                                        </Link>}
                
                <span className='nav-separator'> | </span> 
                <button className='nav-link' onClick={logout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar