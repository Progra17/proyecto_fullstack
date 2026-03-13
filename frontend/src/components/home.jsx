import React, { useEffect } from 'react';
import "./home.css";
import Barra_superior from './barra_superior';
import socket from "../socket";

export default function Home() {

    useEffect(() => {
        //Cuando nos conectamos mandamos un log
        const onConnect = () => {
            console.log("¡Conectado al servidor!");
            // Inmediatamente despues emititmos el evento 
            socket.emit("estoy_listo");
        };

        //Cuando el servidor publica el evento saludo, recibimos su mensaje y lo mostramos en el log
        const onSaludo = (msg) => console.log("Servidor dice:", msg);

        //Encendemos los listeners, es decir, encendemos los procesos 
        socket.on("connect", onConnect);
        socket.on("saludo", onSaludo);

        //Si ya se encontraba conectado antes de cargar el componente, ejecutamos onConnect
        if (socket.connected) onConnect();

        //Cuando nos cambiamos de pagina, apagamos los listeners
        return () => {
            socket.off("connect", onConnect);
            socket.off("saludo", onSaludo);
        };
    }, []);
    
    return (
        <div>
            <Barra_superior />
            <h1>BIENVENIDO</h1>
        </div>
    );
}