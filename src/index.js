// Vendor
// ----------
import React                            from 'react'
import ReactDOM                         from 'react-dom/client'
import { BrowserRouter as Router }      from 'react-router-dom'


// Components
// ----------
import App                              from './components/App'


// Globals
import                                  './app/config'


// Styles
// ----------
import                                  './sass/main.scss'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

