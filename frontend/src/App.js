import Login from "./components/login";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./components/home";
import Empleado from "./components/empleado";
import Proyecto from "./components/proyecto";
import Tarea from "./components/tarea";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}/> {/*Pantalla de Login*/}
      <Route path="/home" element={<Home />}/> {/*Pantalla de Inicio*/}
      <Route path="/proyecto" element={<Proyecto />}/> {/*Pantalla de Proyectos*/}
      <Route path="/tarea" element={<Tarea />}/> {/*Pantalla de Tareas*/}
      <Route path="/empleado" element={<Empleado />}/> {/*Pantalla de Empleados*/}
    </Routes>

    </BrowserRouter>
  );
}

export default App;
