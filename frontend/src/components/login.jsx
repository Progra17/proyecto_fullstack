import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./login.css"

export default function Login() {
    const [usuario, setUsuario] = useState(""); //Creamos la variable y con set se actualizan los valores
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    //esta funcion se ejecuta cuando se le da clic al Submmit
    const validarSesion = async (e) => { //async nos permite utilizar await para esperar respuesta del servidor
        e.preventDefault(); //evitamos que React recargue la pagina en automatico
        //console.log("Usuario: ", usuario) //Imprimimos los valores en la consola
        //console.log("Password: ", password)
        //alert("AQUI VALIDAMOS LA SESION CON AXIOS")

        try {
            //Enviamos una peticion POST al servidor, con await esperamos a obtener una respuesta
            //Los datos se envian en formato JSON
            const res = await axios.post("http://localhost:3001/login", {
                usuario,
                password
            })

            if (res.data.success) { //Validamos si la respuesta fue exitosa
                navigate("/home")
            }

        } catch (error) {
            alert("Usuario o contraseña incorrecta")
        }

    };


    return (
        
            
        <div id="login">
            <form onSubmit={validarSesion}>
                <h1>INICIO DE SESIÓN</h1>

                {/*Creamos el input de usuario*/}
                <input type="text" placeholder="Usuario"
                    value={usuario} /*Muestra lo que hay en la variable*/
                    onChange={(e) => setUsuario(e.target.value)} /*Cada que se cambia, lo guardamos en la variable*/
                    required
                    autoFocus
                />

                <input type="password" placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">INICIAR SESION</button>
            </form>
        </div>
        
    )
}

