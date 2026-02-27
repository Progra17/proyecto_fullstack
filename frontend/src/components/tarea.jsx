import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./tarea.css"

export default function Tarea() {

    const [tarea, setTarea] = useState([]);

    useEffect(() => { //Se ejecuta cada que se renderiza
        axios.get("http://localhost:3001/tarea") //Se hace la peticion al servidor
            .then(res => setTarea(res.data)) //Con setNotas se almacena el contendio
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <div className='contenedor-tarea'>
                {tarea.map(t => (
                    <div className='tarea' key={t.id_tarea}>
                        <h3>TAREAS</h3>
                        <p>{t.id_tarea}</p>
                        <p>{t.nombre_tarea}</p>
                        <p>{t.descripcion_tarea}</p>
                        <p>{t.estatus_tarea}</p>
                        <p>{t.comentarios_tarea}</p>
                        <p>{new Date(t.fecha_inicio).toISOString().split("T")[0]}</p>
                        <p>{new Date(t.fecha_fin).toISOString().split("T")[0]}</p>
                        <p>{t.id_proyecto}</p>
                        <p>{t.id_empleado}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
