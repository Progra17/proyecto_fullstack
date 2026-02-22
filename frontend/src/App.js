//import logo from './logo.svg';
//import './App.css';

import Login from "./components/login";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./components/home";


/*<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>*/

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}/> {/*Pantalla de Login*/}

      <Route path="/home" element={<Home />}/> {/*Pantalla de Bienvenida*/}
    </Routes>

    </BrowserRouter>
  );
}

export default App;
