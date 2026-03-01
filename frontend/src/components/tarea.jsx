import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./tarea.css"
import Barra_superior from './barra_superior';

export default function Tarea() {
    // Valores iniciales del formulario
    const formatoInicial = {
        nombre_tarea: "",
        descripcion_tarea: "",
        estatus_tarea: "Pendiente",
        comentarios_tarea: "",
        fecha_inicio: "",
        fecha_fin: "",
        id_proyecto: "",
        id_empleado: ""
    };

    //Constante para listar las tareas
    const [tareas, setTareas] = useState([]);
    //Constante para la informacion de las tareas
    const [crearTarea, setCrearTarea] = useState(formatoInicial);
    //Constante para la informacion de actualizar tareas
    const [actualizarTarea, setActualizarTarea] = useState(formatoInicial);

    //Constante para los modales
    const [modalCrear, setModalCrear] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);

    //Constantes para extraer los nombres y proyectos presentes en la base de datos
    const [empleados, setEmpleados] = useState([]);
    const [proyectos, setProyectos] = useState([]);

    //CARGAMOS TODAS LAS TAREAS
    useEffect(() => { //Se ejecuta cada que se renderiza
        axios.get("http://localhost:3001/tarea") //Se hace la peticion al servidor para cargar todas las tareas
            .then(res => setTareas(res.data))
            .catch(err => console.error(err));

        axios.get("http://localhost:3001/empleados") //Se hace la peticion al servidor para cargar todos los empleados
            .then(res => setEmpleados(res.data))
            .catch(err => console.error(err));

        axios.get("http://localhost:3001/proyectos") //Se hace la peticion al servidor para cargar todos los proyectos
            .then(res => setProyectos(res.data))
            .catch(err => console.error(err));

    }, []);

    // Cuando lleguen los proyectos desde el backend,
    // asigna automáticamente el primero al formulario de crear para evitar tener vacios
    useEffect(() => {
        if (proyectos.length > 0 && crearTarea.id_proyecto === "") {
            setCrearTarea(prev => ({
                ...prev,
                id_proyecto: proyectos[0].id_proyecto
            }));
        }
    }, [proyectos]);

    //Cada que se actualiza un input, se pasa el valor para CREAR TAREA
    const handleChange = (e) => {
        setCrearTarea({
            ...crearTarea, //Con esto evitamos borrar valores anteriores cada que se actualiza un dato
            [e.target.name]: e.target.value
        });
    };

    // Guarda los datos conforme se vayan generando cambios en el formulario de actualizacion
    const handleChangeActualizar = (e) => {
        setActualizarTarea({
            ...actualizarTarea,
            [e.target.name]: e.target.value
        });
    };

    // Enviar formulario para CREAR LA TAREA
    const enviarCrear = (e) => {
        e.preventDefault();

        //Extaremos los valores para las constantes y verificar que cumplan las caracteristicas especificadas
        const { fecha_inicio, fecha_fin } = crearTarea;

        // 1. Validar fechas
        if (new Date(fecha_fin) < new Date(fecha_inicio)) {
            alert("La fecha de fin no puede ser menor que la fecha de inicio.");
            return;
        }

        //Enviamos la solicitud con el metodo post
        axios.post("http://localhost:3001/tarea", crearTarea)
            .then(() => {
                alert("Tarea creada correctamente"); //Mensaje de registro exitoso
                setCrearTarea(formatoInicial); //Limpiamos el formulario
                setModalCrear(false); //Cerramos el modal
                return axios.get("http://localhost:3001/tarea"); //Regresamos la lista actualizada
            })
            //Mostramos las tareas actualizadas
            .then(res => setTareas(res.data))
            .catch(err => console.error(err));
    };

    //Permite manejar la seleccion de IDs para ACTUALIZAR LA TAREA
    const handleSelectChange = (e) => {
        const id = e.target.value;

        //Enviamos la solicitud de actualizacion con el metodo put, donde pasamos el ID del proyecto
        const tareaSeleccionada = tareas.find(t => t.id_tarea.toString() === id);

        //Rellenamos los datos con los campos con los que cuenta el ID
        if (tareaSeleccionada) {
            setActualizarTarea({
                id_tarea: id,
                nombre_tarea: tareaSeleccionada.nombre_tarea,
                descripcion_tarea: tareaSeleccionada.descripcion_tarea,
                estatus_tarea: tareaSeleccionada.estatus_tarea,
                comentarios_tarea: tareaSeleccionada.comentarios_tarea || "",
                fecha_inicio: tareaSeleccionada.fecha_inicio.split("T")[0],
                fecha_fin: tareaSeleccionada.fecha_fin.split("T")[0],
                id_proyecto: tareaSeleccionada.id_proyecto,
                id_empleado: tareaSeleccionada.id_empleado || ""
            });
        } else {
            setActualizarTarea(formatoInicial); // si selecciona "--Selecciona una tarea--"
        }
    };

    //Enviar solicitud de actualizacion al servidor
    const enviarActualizar = (e) => {
        e.preventDefault();

        const { fecha_inicio, fecha_fin } = actualizarTarea;

        // 1. Validar fechas
        if (new Date(fecha_fin) < new Date(fecha_inicio)) {
            alert("La fecha de fin no puede ser menor que la fecha de inicio.");
            return;
        }

        //Enviamos la solicitud de actualizacion con el metodo put, donde pasamos el ID del proyecto
        axios.put(`http://localhost:3001/tarea/${actualizarTarea.id_tarea}`, actualizarTarea)
            .then(res => {
                alert(res.data.message);
                setActualizarTarea({ ...formatoInicial, id_tarea: "" });
                setModalActualizar(false);
                return axios.get("http://localhost:3001/tarea");
            })
            .then(res => setTareas(res.data))
            .catch(err => console.error(err));
    };

    //Funcion para eliminar la tarea
    const eliminarTarea = (id) => { //Se envia el ID
        if (window.confirm("¿Estás seguro de eliminar esta tarea?")) { //Se solicita confirmacion
            axios.delete(`http://localhost:3001/tarea/${id}`)
                .then(res => {
                    alert(res.data.message);//Mensaje de borrado exitoso
                    // Refrescar lista de tareas
                    return axios.get("http://localhost:3001/tarea");
                })
                .then(res => setTareas(res.data))
                .catch(err => console.error(err));
        }
    };

    return (
        <div>
            <Barra_superior />
            <h3>TAREAS</h3>

            {/*Botones para actualizar y crear un proyecto*/}
            <div className='botones'>
                <button className="btn-abrir" onClick={() => setModalCrear(true)}>
                    CREAR TAREA
                </button>

                <button className="btn-abrir" onClick={() => setModalActualizar(true)}>
                    ACTUALIZAR TAREA
                </button>
            </div>

            {/*MODAL PARA CREAR LA TAREA*/}
            {modalCrear && (
                <div className="modal-fondo" onClick={() => setModalCrear(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>CREAR NUEVA TAREA</h2>

                        <form onSubmit={enviarCrear} className="form-tarea">
                            <p>NOMBRE DE LA TAREA</p>
                            <input
                                type="text"
                                name="nombre_tarea"
                                placeholder="Nombre de la tarea"
                                value={crearTarea.nombre_tarea}
                                onChange={handleChange}
                                required
                            />
                            <p>DESCRIPCIÓN DE LA TAREA</p>
                            <input
                                type="text"
                                name="descripcion_tarea"
                                placeholder="Descripción"
                                value={crearTarea.descripcion_tarea}
                                onChange={handleChange}
                                required
                            />
                            <p>ESTATUS DE LA TAREA</p>
                            <select
                                name="estatus_tarea"
                                value={crearTarea.estatus_tarea}
                                onChange={handleChange}
                            >
                                <option>Pendiente</option>
                                <option>En proceso</option>
                                <option>En pruebas</option>
                                <option>Finalizado</option>
                                <option>Solucionando errores</option>
                                <option>Cancelado</option>
                            </select>
                            <p>COMENTARIOS DE LA TAREA</p>
                            <input
                                type="text"
                                name="comentarios_tarea"
                                placeholder="Comentarios"
                                value={crearTarea.comentarios_tarea}
                                onChange={handleChange}
                            />
                            <p>FECHA DE INCIO</p>
                            <input
                                type="date"
                                name="fecha_inicio"
                                value={crearTarea.fecha_inicio}
                                onChange={handleChange}
                                required
                            />
                            <p>FECHA DE FIN</p>
                            <input
                                type="date"
                                name="fecha_fin"
                                value={crearTarea.fecha_fin}
                                onChange={handleChange}
                                required
                            />
                            <p>ID DEL PROYECTO</p>
                            <select
                                name='id_proyecto'
                                value={crearTarea.id_proyecto}
                                onChange={handleChange}
                            >
                                {proyectos.map(pro => ( //Se mapean los proyectos disponibles y se listan
                                    <option key={pro.id_proyecto} value={pro.id_proyecto}>
                                        {pro.id_proyecto} - {pro.nombre_proyecto}
                                    </option>
                                ))}
                            </select>
                            <p>ID DEL EMPLEADO</p>
                            <select
                                name='id_empleado'
                                value={crearTarea.id_empleado}
                                onChange={handleChange}
                            >
                                <option value="">--SELECCIONA UN EMPLEADO--</option>
                                {empleados.map(emp => (//Se mapean los empleados disponibles y se listan
                                    <option key={emp.id_empleado} value={emp.id_empleado}>
                                        {emp.id_empleado} - {emp.primer_nombre} {emp.apellido_paterno}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className='btn-accion'
                                disabled={proyectos.length === 0}>Crear tarea</button>
                        </form>

                        <button className="cerrar" onClick={() => setModalCrear(false)}>Cerrar</button>
                    </div>
                </div>
            )}
            
            {/*MODAL PARA ACTUALIZAR*/}
            {modalActualizar && (
                <div className="modal-fondo" onClick={() => setModalActualizar(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>ACTUALIZAR TAREA</h2>

                        <p>SELECCIONA LA TAREA:</p>
                        <select value={actualizarTarea.id_tarea} onChange={handleSelectChange}>
                            <option value="">SELECCIONA UNA TAREA</option>
                            {tareas.map(t => (
                                <option key={t.id_tarea} value={t.id_tarea}>
                                    {t.id_tarea} - {t.nombre_tarea}
                                </option>
                            ))}
                        </select>

                        <form onSubmit={enviarActualizar} className="form-tarea">
                            <p>NOMBRE DE LA TAREA</p>
                            <input
                                type="text"
                                name="nombre_tarea"
                                value={actualizarTarea.nombre_tarea}
                                onChange={handleChangeActualizar}
                                placeholder="Nombre de la tarea"
                                required
                            />
                            <p>DESCRIPCIÓN DE LA TAREA</p>
                            <input
                                type="text"
                                name="descripcion_tarea"
                                value={actualizarTarea.descripcion_tarea}
                                onChange={handleChangeActualizar}
                                placeholder="Descripción"
                                required
                            />
                            <p>ESTATUS DE LA TAREA</p>
                            <select
                                name="estatus_tarea"
                                value={actualizarTarea.estatus_tarea}
                                onChange={handleChangeActualizar}
                            >
                                <option>Pendiente</option>
                                <option>En proceso</option>
                                <option>En pruebas</option>
                                <option>Finalizado</option>
                                <option>Solucionando errores</option>
                                <option>Cancelado</option>
                            </select>
                            <p>COMENTARIOS DE LA TAREA</p>
                            <input
                                type="text"
                                name="comentarios_tarea"
                                value={actualizarTarea.comentarios_tarea}
                                onChange={handleChangeActualizar}
                                placeholder="Comentarios"
                            />
                            <p>FECHA DE INICIO</p>
                            <input
                                type="date"
                                name="fecha_inicio"
                                value={actualizarTarea.fecha_inicio}
                                onChange={handleChangeActualizar}
                                required
                            />
                            <p>FECHA DE FIN</p>
                            <input
                                type="date"
                                name="fecha_fin"
                                value={actualizarTarea.fecha_fin}
                                onChange={handleChangeActualizar}
                                required
                            />
                            <p>ID DEL PROYECTO</p>
                            <select
                                name='id_proyecto'
                                value={actualizarTarea.id_proyecto}
                                onChange={handleChangeActualizar}
                            >
                                {proyectos.map(pro => (//Se mapean los proyectos y se listan
                                    <option key={pro.id_proyecto} value={pro.id_proyecto}>
                                        {pro.id_proyecto} - {pro.nombre_proyecto}
                                    </option>
                                ))}
                            </select>
                            <p>ID DEL EMPLEADO</p>
                            <select
                                name='id_empleado'
                                value={actualizarTarea.id_empleado}
                                onChange={handleChangeActualizar}
                            >
                                {empleados.map(emp => ( //Se mapean los empleados y se listan
                                    <option key={emp.id_empleado} value={emp.id_empleado}>
                                        {emp.id_empleado} - {emp.primer_nombre} {emp.apellido_paterno}
                                    </option>
                                ))}
                            </select>

                            <button type="submit" className='btn-accion'>Actualizar</button>
                        </form>

                        <button className="cerrar" onClick={() => setModalActualizar(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            {/*LISTA DE TAREAS*/}
            <div className='contenedor-tarea'>
                {tareas.map(t => (
                    <div className='tarea' key={t.id_tarea}>
                        <div className='tarea-content'>
                            <h3>{t.nombre_tarea}</h3>
                            <p><b>ID:</b> {t.id_tarea}</p>
                            <p><b>DESCRIPCIÓN:</b> {t.descripcion_tarea}</p>
                            <p><b>ESTATUS:</b> {t.estatus_tarea}</p>
                            <p><b>COMENTARIOS:</b> {t.comentarios_tarea}</p>
                            <p><b>FECHA DE INICIO:</b> {new Date(t.fecha_inicio).toISOString().split("T")[0]}</p>
                            <p><b>FECHA DE FIN:</b> {new Date(t.fecha_fin).toISOString().split("T")[0]}</p>
                            {/*AQUI SE EXTRAE EL NOMBRE GRACIAS A LA CONSULTA JOIN*/}
                            <p><b>PROYECTO:</b> {t.nombre_proyecto}</p> 
                            {/*AQUI SE EXTRAE EL NOMBRE GRACIAS A LA CONSULTA JOIN*/}
                            <p><b>EMPLEADO:</b> {t.nombre_empleado}</p>
                        </div>
                        <button onClick={() => eliminarTarea(t.id_tarea)}>Eliminar</button>
                    </div>
                ))}
            </div>

        </div>
    )
}
