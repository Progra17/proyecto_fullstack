import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./empleado.css"

export default function Empleado() {

    const [empleado, setEmpleado] = useState([]);

    useEffect(() => { //Se ejecuta cada que se renderiza
        axios.get("http://localhost:3001/empleado") //Se hace la peticion al servidor
            .then(res => setEmpleado(res.data)) //Con setNotas se almacena el contendio
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <div className='contenedor-empleado'>
                {empleado.map(e => (
                    <div className='empleado' key={e.id_empleado}>
                        <h3>EMPLEADOS</h3>
                        <p>{e.id_empleado}</p>
                        <p>{e.primer_nombre}</p>
                        <p>{e.segundo_nombre}</p>
                        <p>{e.apellido_paterno}</p>
                        <p>{e.apellido_materno}</p>
                        <p>{e.edad_empleado}</p>
                        <p>{e.telefono_empleado}</p>
                        <p>{e.correo_empleado}</p>
                        <p>{e.puesto_empleado}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
