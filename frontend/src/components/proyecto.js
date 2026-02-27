import React, { useEffect, useState} from 'react'
import axios from 'axios'

export default function Proyecto() {

    const [proyecto, setProyecto] = useState([]);

    useEffect(() => { //Se ejecuta cada que se renderiza
        axios.get("http://localhost:3001/proyecto") //Se hace la peticion al servidor
            .then(res => setProyecto(res.data)) //Con setNotas se almacena el contendio
            .catch(err => console.error(err));
    }, []);

    return (
        <div className='contenedor-proyecto'>
            {proyecto.map(p => (
                <div className='proyecto' key={p.id_proyecto}>
                    <h3>{p.nombre_proyecto}</h3>
                    <p>{p.id_proyecto}</p>
                    <p>{p.estado_proyecto}</p>
                </div>
            ))}
        </div>
    )
}
