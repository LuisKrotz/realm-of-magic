import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import Navbar from "./features/Navbar";
import CreateRoutes from "./routes/CreateRoutes";

import 'react-toastify/dist/ReactToastify.css';
import '../sass/app.scss'



const App = () => {
  const location = useLocation()
  const navigate = useNavigate()

  let token = sessionStorage?.getItem(global.config.tokens.authToken)

  useEffect(() => {
    if(!token) navigate(global.config.routes.login)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  

  return (
      <div className="magic">
        {(token !== undefined && token !== null && location.pathname !== global.config.routes.login) &&
            <Navbar />
        }

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover />


        <CreateRoutes />
      </div>
  )
}

export default App