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


//LEER (READ)
//Endpoint para obtener todos los proyectos
app.get('/proyecto', (req, res) => {
    connection.query('SELECT * FROM proyecto', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

//Endpoint para obtener todos los empleados
app.get('/empleado', (req, res) => {
    connection.query('SELECT * FROM empleado', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

//Endpoint para obtener todas las tareas
app.get('/tarea', (req, res) => {
    const sql = `
        SELECT 
            t.*,
            p.nombre_proyecto,
            CONCAT(e.primer_nombre, ' ', e.apellido_paterno) AS nombre_empleado
        FROM tarea t
        LEFT JOIN proyecto p ON p.id_proyecto = t.id_proyecto
        LEFT JOIN empleado e ON e.id_empleado = t.id_empleado;
    `;
    connection.query(sql, (error, results) => {
        if (error) {
            console.error("Error en consulta de tareas con JOIN:", error);
            return res.status(500).json({ error: "Error en consulta de tareas" });
        }
        res.json(results);
    });
});

//CREAR UN NUEVO EMPLEADO
app.post('/empleado', (req, res) => {
    const {
        primer_nombre,
        segundo_nombre,
        apellido_paterno,
        apellido_materno,
        edad_empleado,
        telefono_empleado,
        correo_empleado,
        puesto_empleado
    } = req.body;

    const sql = `
        INSERT INTO empleado 
        (primer_nombre,
        segundo_nombre,
        apellido_paterno,
        apellido_materno,
        edad_empleado,
        telefono_empleado,
        correo_empleado,
        puesto_empleado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(sql, [
        primer_nombre,
        segundo_nombre || null,
        apellido_paterno,
        apellido_materno || null,
        edad_empleado,
        telefono_empleado,
        correo_empleado,
        puesto_empleado
    ], (error, result) => {
        if (error) throw error;
        res.json({ message: "Empleado creado correctamente", id: result.insertId });
    });

});

//ACTUALIZAR UN EMPLEADO
app.put('/empleado/:id', (req, res) => {
    const { id } = req.params; // ID del empleado a actualizar
    const {
        primer_nombre,
        segundo_nombre,
        apellido_paterno,
        apellido_materno,
        edad_empleado,
        telefono_empleado,
        correo_empleado,
        puesto_empleado
    } = req.body;

    const sql = `
        UPDATE empleado
        SET primer_nombre = ?, 
            segundo_nombre = ?, 
            apellido_paterno = ?, 
            apellido_materno = ?, 
            edad_empleado = ?,
            telefono_empleado = ?,
            correo_empleado = ?,
            puesto_empleado = ?
        WHERE id_empleado = ?
    `;

    connection.query(sql, [
        primer_nombre,
        segundo_nombre,
        apellido_paterno,
        apellido_materno,
        edad_empleado,
        telefono_empleado,
        correo_empleado,
        puesto_empleado,
        id
    ], (error, result) => {
        if (error) throw error;
        res.json({ message: "Empleado actualizado correctamente", affectedRows: result.affectedRows });
    });
});


//CREAR UN NUEVO PROYECTO
app.post('/proyecto', (req, res) => {
    const {
        nombre_proyecto,
        descripcion_proyecto,
        estado_proyecto,
        fecha_inicio,
        fecha_fin,
    } = req.body;

    const sql = `
        INSERT INTO proyecto 
        (nombre_proyecto, descripcion_proyecto, estado_proyecto, fecha_inicio, fecha_fin)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(sql, [
        nombre_proyecto,
        descripcion_proyecto,
        estado_proyecto,
        fecha_inicio,
        fecha_fin,
    ], (error, result) => {
        if (error) throw error;
        res.json({ message: "Proyecto creado correctamente", id: result.insertId });
    });

});

//ACTUALIZAR UN PROYECTO
app.put('/proyecto/:id', (req, res) => {
    const { id } = req.params; // ID del proyecto a actualizar
    const {
        nombre_proyecto,
        descripcion_proyecto,
        estado_proyecto,
        fecha_inicio,
        fecha_fin,
    } = req.body;

    const sql = `
        UPDATE proyecto
        SET nombre_proyecto = ?, 
            descripcion_proyecto = ?, 
            estado_proyecto = ?, 
            fecha_inicio = ?, 
            fecha_fin = ?
        WHERE id_proyecto = ?
    `;

    connection.query(sql, [
        nombre_proyecto,
        descripcion_proyecto,
        estado_proyecto,
        fecha_inicio,
        fecha_fin,
        id
    ], (error, result) => {
        if (error) throw error;
        res.json({ message: "Proyecto actualizado correctamente", affectedRows: result.affectedRows });
    });
});


//ACTUALIZAR (UPDATE)
//Endpoint para actualizar una tarea
app.put('/tarea/:id', (req, res) => {
    const { id } = req.params; // ID de la tarea a actualizar
    const {
        nombre_tarea,
        descripcion_tarea,
        estatus_tarea,
        comentarios_tarea,
        fecha_inicio,
        fecha_fin,
        id_proyecto,
        id_empleado
    } = req.body;

    const sql = `
        UPDATE tarea
        SET nombre_tarea = ?, 
            descripcion_tarea = ?, 
            estatus_tarea = ?, 
            comentarios_tarea = ?, 
            fecha_inicio = ?, 
            fecha_fin = ?, 
            id_proyecto = ?, 
            id_empleado = ?
        WHERE id_tarea = ?
    `;

    connection.query(sql, [
        nombre_tarea,
        descripcion_tarea,
        estatus_tarea,
        comentarios_tarea,
        fecha_inicio,
        fecha_fin,
        id_proyecto,
        id_empleado || null,
        id
    ], (error, result) => {
        if (error) throw error;
        res.json({ message: "Tarea actualizada correctamente", affectedRows: result.affectedRows });
    });
});

//CREAR (CREATE)
//Endpoint para crear una tarea
app.post('/tarea', (req, res) => {
    const {
        nombre_tarea,
        descripcion_tarea,
        estatus_tarea,
        comentarios_tarea,
        fecha_inicio,
        fecha_fin,
        id_proyecto,
        id_empleado
    } = req.body;

    const sql = `
        INSERT INTO tarea 
        (nombre_tarea, descripcion_tarea, estatus_tarea, comentarios_tarea, fecha_inicio, fecha_fin, id_proyecto, id_empleado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(sql, [
        nombre_tarea,
        descripcion_tarea,
        estatus_tarea,
        comentarios_tarea,
        fecha_inicio,
        fecha_fin,
        id_proyecto,
        id_empleado || null
    ], (error, result) => {
        if (error) throw error;
        res.json({ message: "Tarea creada correctamente", id: result.insertId });
    });

});

// BORRAR (DELETE)
// Endpoint para eliminar una tarea
app.delete('/tarea/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM tarea WHERE id_tarea = ?`;
    connection.query(sql, [id], (error, result) => {
        if (error) throw error;
        res.json({ message: "Tarea eliminada correctamente", affectedRows: result.affectedRows });
    });
});

app.get("/empleados", (req, res) => {
    connection.query("SELECT id_empleado, primer_nombre, apellido_paterno FROM empleado", (error, result) => {
        if (error) return res.status(500).send(error);
        res.json(result);
    });
});

app.get("/proyectos", (req, res) => {
    connection.query("SELECT id_proyecto, nombre_proyecto FROM proyecto", (error, result) => {
        if (error) return res.status(500).send(error);
        res.json(result);
    });
});


app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en http://localhost:${PORT}`);
});