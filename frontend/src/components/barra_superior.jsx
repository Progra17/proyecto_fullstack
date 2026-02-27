import React from 'react'
import { Link } from 'react-router-dom'
import "./barra_superior.css"

export default function Barra_superior() {
 return (
    <div id="barra-superior">
                <ul>
                    <li><Link to="/home">INICIO</Link></li>
                    <li><Link to="/proyecto">PROYECTOS</Link></li>
                    <li><Link to="/tarea">TAREAS</Link></li>
                    <li><Link to="/empleado">EMPLEADOS</Link></li>
                </ul>
            </div>
  )
}
