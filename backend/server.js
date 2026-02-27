const express = require('express'); //Importamos la librera express para poder crear un servidor en Node
const cors = require('cors') //Importamos la libreria cors para poder hacer peticiones entre frontend y backend
const mysql = require('mysql') //Importamos mysql

const app = express(); //Creamos una instancia de la aplicacion, utilizando la libreria express
app.use(cors()); //Habilita que el frontend pueda hacer peticiones a este servidor
app.use(express.json()); //Permite que Express pueda leer objetos JSON enviados desde el frontend.

const PORT = 3001; //Definimos en que puerto se levantara el servidor

//Configuracion para conectar a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2Link001',
    database: 'fullstack',
});

//Conexion con la base de datos
connection.connect(error => {
    if (error) throw error;
    console.log("Conexion exitosa a la base de datos");
});

app.post('/login', (req, res) => { //Define una ruta POST
    const { usuario, password } = req.body; //Contiene los datos enviados por React en el formulario de frontend 

    if (usuario === "admin" && password === "1234") {
        //Se envia una respuesta exitosa
        res.json({ success: true })
    } else {
        res.status(401).json({ success: false }) //Se envia el error 401 de "unauthorized"
    }

});

//Endpoint para obtener todos los proyectos
app.get('/proyecto', (req, res) => {
    connection.query('SELECT * FROM proyecto', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

//Endpoint para obtener todos los proyectos
app.get('/empleado', (req, res) => {
    connection.query('SELECT * FROM empleado', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

//Endpoint para obtener todos los proyectos
app.get('/tarea', (req, res) => {
    connection.query('SELECT * FROM tarea', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en http://localhost:${PORT}`);
});