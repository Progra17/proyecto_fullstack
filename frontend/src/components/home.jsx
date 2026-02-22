import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import "./home.css"


export default function Home() {

    const mostrarInfoDesarrollador = () => {
        alert(
            "DESARROLLADOR:\n" +
            "Nombre: Andres Rodriguez\n" +
            "Matricula: AL05135478\n" +
            "Rol: Estudiante / Desarrollador del proyecto"
        )
    }

    const mostrarInfoEvaluador = () => {
        alert(
            "EVALUADOR:\n" +
            "Nombre: Misael Bravo Sandre\n" +
            "Materia: Desarrollo Fullstack\n" +
            "Institución: TecMilenio"

        )
    }

    //Creamos una constante de estado llamada notas, que se inicializa vacio, y guardara los datos de la repuesta
    //del get proveniente del servidor
    const [notas, setNotas] = useState([]);

    //Aqui se cargan los datos provenientes de la respuesta
    useEffect(() => { //Se ejecuta cada que se renderiza
        axios.get("http://localhost:3001/api/notas") //Se hace la peticion al servidor
            .then(res => setNotas(res.data)) //Con setNotas se almacena el contendio
            .catch(err => console.error(err));
    }, []);

    return (
        <div>

            <div id="barra-superior">
                <ul>
                    <li onClick={mostrarInfoDesarrollador}>Sobre mí</li>
                    <li onClick={mostrarInfoEvaluador}>Sobre el evaluador</li>
                </ul>
            </div>

            <div className="contenedor-notas">
                {/*Se genera un mapa de la variable notas, es decir, se recorre cada elemento del arreglo*/}
                {notas.map(nota => ( //por cada objeto o nota, se genera su respectivo bloque de HTML
                    <div className="nota" key={nota.id}> 
                        <img src={nota.img} alt={nota.titulo} />
                        <h3>{nota.titulo}</h3>
                        <p>{nota.texto}</p>
                    </div>
                ))}
            </div>

           
            </div>
       
    )
}
