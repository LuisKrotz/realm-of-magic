import { useEffect } from "react";
import { useNavigate, useLocation, Routes, Route, Link } from "react-router-dom";


import List from "./pages/List"
import Create from "./pages/Create"
import Login from "./pages/Login"
import '../sass/app.scss'


const App = () => {
  const location = useLocation()
  const navigate = useNavigate()

  let token = sessionStorage.getItem(global.config.tokens.authToken)

  useEffect(() => {
    navigate(!token ?? global.config.routes.login)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const logout = () => {
    sessionStorage.removeItem(global.config.tokens.authToken)

    navigate(global.config.routes.login)
  }
  

  return (
      <div className="magic">
        <h1>Magic demo</h1>
        {(token !== undefined && token !== null && location.pathname !== global.config.routes.login) &&
        <nav>
          <span>Logo Aqui</span>

          <div>
            {(location.pathname === global.config.routes.list) && <Link to={global.config.routes.create}>Create Magic</Link>}
            {(location.pathname === global.config.routes.create) && <Link to={global.config.routes.list}>List Magic</Link>}
            <span> | </span> 
            <button onClick={logout}>Sign Out</button>
          </div>
        </nav>
        }

        <Routes>
          <Route path={global.config.routes.login}
            element={<Login />}
          />

          <Route path={global.config.routes.list}
            element={<List />}
          />

          <Route path={global.config.routes.create}
            element={<Create />}
          />
        </Routes>
      </div>
  )
}

export default App