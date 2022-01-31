import React from "react";
import {Router, Route, Link, Switch} from "wouter";
import Agenda from './Agenda';
import Mascotas from './mascotas';
import Servicios from './Servicios';
import App from '../App';
import logo1 from "../img/huella.png";

const logo = require('../img/huella.png');

 const NavBar = () =>{
         return(
          <Router>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
              <div class="container-fluid">
                <Link class="navbar-brand" to="/"><a><img src={logo} height="25px" /></a></Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                  <ul class="navbar-nav">
                    <li class="nav-item">
                      <Link class="nav-link active" aria-current="page" to="/">Agendar cita</Link>
                    </li>
                    <li class="nav-item">
                      <Link class="nav-link" to="/Clientes">Clientes</Link>
                    </li>
                    <li class="nav-item">
                      <Link class="nav-link" to="/mascotas">Mascotas</Link>
                    </li>
                    <li class="nav-item">
                      <Link class="nav-link" to="/Servicios">Servicios</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            <Switch>

              <Route path="/">
                <Agenda />
              </Route>

              <Route path="/Clientes">
                <App />
              </Route>

              <Route path="/mascotas">
                <Mascotas />
              </Route>

              <Route path="/Servicios">
                <Servicios />
              </Route>

            </Switch> 
            
          </Router>
        )
 }

 export default NavBar;