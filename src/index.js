import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import NavBar from './vistas/NavBar';
import Mascotas from './vistas/mascotas';
import Agenda from './vistas/Agenda';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  
  <React.StrictMode>
    <NavBar/>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();