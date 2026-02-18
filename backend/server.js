const express = require('express'); //Importamos la librera express para poder crear un servidor en Node
const cors = require('cors') //Importamos la libreria cors para poder hacer peticiones entre frontend y backend
const app = express(); //Creamos una instancia de la aplicacion, utilizando la libreria express
const PORT = 3001; //Definimos en que puerto se levantara el servidor

app.use(cors()); //Habilita que el frontend pueda hacer peticiones a este servidor
app.use(express.json()); //Permite que Express pueda leer objetos JSON enviados desde el frontend.

app.post('/login', (req, res) => { //Define una ruta POST
    const {usuario, password} = req.body; //Contiene los datos enviados por React en el formulario de frontend 

    if (usuario === "admin" && password === "1234"){
        res.json({success: true}) //Se envia una respuesta exitosa
    }else{
        res.status(401).json({success: false}) //Se envia un error con respuesta fallida
    }
})

app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en http://localhost:${PORT}`);
});