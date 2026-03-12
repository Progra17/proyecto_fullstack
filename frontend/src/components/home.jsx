import React, { useEffect } from 'react';
import "./home.css";
import Barra_superior from './barra_superior';
import socket from "../socket";

export default function Home() {

    useEffect(() => {
        const onConnect = () => {
            console.log("¡Conectado al servidor!");
            // Le avisamos al servidor que ya configuramos los listeners
            socket.emit("estoy_listo");
        };

        const onSaludo = (msg) => console.log("Servidor dice:", msg);

        socket.on("connect", onConnect);
        socket.on("saludo", onSaludo);

        if (socket.connected) onConnect();

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