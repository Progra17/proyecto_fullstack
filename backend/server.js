const express = require('express'); //Importamos la librera express para poder crear un servidor en Node
const cors = require('cors') //Importamos la libreria cors para poder hacer peticiones entre frontend y backend
const app = express(); //Creamos una instancia de la aplicacion, utilizando la libreria express
const PORT = 3001; //Definimos en que puerto se levantara el servidor

app.use(cors()); //Habilita que el frontend pueda hacer peticiones a este servidor
app.use(express.json()); //Permite que Express pueda leer objetos JSON enviados desde el frontend.

app.post('/login', (req, res) => { //Define una ruta POST
    const { usuario, password } = req.body; //Contiene los datos enviados por React en el formulario de frontend 

    if (usuario === "admin" && password === "1234") {
        res.json({ success: true }) //Se envia una respuesta exitosa
    } else {
        res.status(401).json({ success: false }) //Se envia el error 401 de "unauthorized"
    }

})

app.get('/api/notas', (req, res) => { //Crea una ruta tipo GET, con la direccion /api/notas
    //en este caso no hay datos que necesite de requerimiento, ya que solo cargara las notas como respuesta
    res.json([ //La respuesta se comparte en tipo JSON, donde cada objeto es una nota
        { id: 1, titulo: "Tecnología en 2024", texto: "Avances en IA y automatización transforman industrias.", img: "https://picsum.photos/400/200" },
        { id: 2, titulo: "Salud y Bienestar", texto: "Tendencias en hábitos saludables y medicina preventiva.", img: "https://picsum.photos/400/201" },
        { id: 3, titulo: "Economía Global", texto: "Expectativas económicas ante un nuevo panorama internacional.", img: "https://picsum.photos/400/202" },
        { id: 4, titulo: "Desarrollo Web", texto: "Nuevos frameworks y prácticas para el frontend moderno.", img: "https://picsum.photos/400/203" },
        { id: 5, titulo: "Espacio y Ciencia", texto: "Nuevos descubrimientos sobre exoplanetas cercanos.", img: "https://picsum.photos/400/204" },
        { id: 6, titulo: "Medio Ambiente", texto: "Acciones urgentes frente al cambio climático.", img: "https://picsum.photos/400/205" },
        { id: 7, titulo: "Cultura Digital", texto: "Cómo las redes sociales moldean la sociedad actual.", img: "https://picsum.photos/400/206" },
        { id: 8, titulo: "Educación Moderna", texto: "Tendencias en aprendizaje híbrido y remoto.", img: "https://picsum.photos/400/207" },
        { id: 9, titulo: "Innovación Empresarial", texto: "Métodos ágiles y transformación tecnológica en empresas.", img: "https://picsum.photos/400/208" }
    ]);
});

app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en http://localhost:${PORT}`);
});