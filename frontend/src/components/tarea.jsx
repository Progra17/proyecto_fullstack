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

    //Constantes
    const [tareas, setTareas] = useState([]);
    const [crearTarea, setCrearTarea] = useState(formatoInicial);
    const [actualizarTarea, setActualizarTarea] = useState(formatoInicial);

    const [modalCrear, setModalCrear] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);

    const [empleados, setEmpleados] = useState([]);
    const [proyectos, setProyectos] = useState([]);

    //CARGAMOS TODAS LAS TAREAS
    useEffect(() => { //Se ejecuta cada que se renderiza
        axios.get("http://localhost:3001/tarea") //Se hace la peticion al servidor
            .then(res => setTareas(res.data))
            .catch(err => console.error(err));

        axios.get("http://localhost:3001/empleados")
            .then(res => setEmpleados(res.data))
            .catch(err => console.error(err));

        axios.get("http://localhost:3001/proyectos")
            .then(res => setProyectos(res.data))
            .catch(err => console.error(err));

    }, []);

    // Cuando lleguen los proyectos desde el backend,
    // asigna automáticamente el primero al formulario de crear
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

    // Para el formulario de actualizar
    const handleChangeActualizar = (e) => {
        setActualizarTarea({
            ...actualizarTarea,
            [e.target.name]: e.target.value
        });
    };

    // Enviar formulario para CREAR LA TAREA
    const enviarCrear = (e) => {
        e.preventDefault();

        axios.post("http://localhost:3001/tarea", crearTarea)
            .then(() => {
                alert("Tarea creada correctamente");
                setCrearTarea(formatoInicial);
                setModalCrear(false);
                return axios.get("http://localhost:3001/tarea");
            })
            //Mostramos las tareas actualizadas
            .then(res => setTareas(res.data))
            .catch(err => console.error(err));
    };

    //Permite manejar la seleccion de IDs para ACTUALIZAR LA TAREA
    const handleSelectChange = (e) => {
        const id = e.target.value;

        const tareaSeleccionada = tareas.find(t => t.id_tarea.toString() === id);
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

    const eliminarTarea = (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
            axios.delete(`http://localhost:3001/tarea/${id}`)
                .then(res => {
                    alert(res.data.message);
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

            <div className='botones'>
                <button className="btn-abrir" onClick={() => setModalCrear(true)}>
                    CREAR TAREA
                </button>

                <button className="btn-abrir" onClick={() => setModalActualizar(true)}>
                    ACTUALIZAR TAREA
                </button>
            </div>

            {modalCrear && (
                <div className="modal-fondo" onClick={() => setModalCrear(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>CREAR NUEVA TAREA</h2>

                        <form onSubmit={enviarCrear} className="form-tarea">
                            {/* TUS INPUTS */}
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
                                {proyectos.map(pro => (
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
                                {empleados.map(emp => (
                                    <option key={emp.id_empleado} value={emp.id_empleado}>
                                        {emp.id_empleado} - {emp.primer_nombre} {emp.apellido_paterno}
                                    </option>
                                ))}
                            </select>

                            {/* ... los demás inputs igual */}

                            <button 
                            type="submit" 
                            className='btn-accion' 
                            disabled={proyectos.length===0}>Crear tarea</button>
                        </form>

                        <button className="cerrar" onClick={() => setModalCrear(false)}>Cerrar</button>
                    </div>
                </div>
            )}

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
                            {/* INPUTS */}
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
                                {proyectos.map(pro => (
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
                                <option value="">--SELECCIONA UN EMPLEADO--</option>
                                {empleados.map(emp => (
                                    <option key={emp.id_empleado} value={emp.id_empleado}>
                                        {emp.id_empleado} - {emp.primer_nombre} {emp.apellido_paterno}
                                    </option>
                                ))}
                            </select>

                            {/* ... los demás inputs */}

                            <button type="submit" className='btn-accion'>Actualizar</button>
                        </form>

                        <button className="cerrar" onClick={() => setModalActualizar(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            <div className='contenedor-tarea'>
                {tareas.map(t => (
                    <div className='tarea' key={t.id_tarea}>
                        <div className='tarea-content'>
                            <h3>{t.nombre_tarea}</h3>
                            <p><b>ID:</b> {t.id_tarea}</p>
                            <p><b>DESCRIPCIÓN:</b> {t.descripcion_tarea}</p>
                            <p><b>ESTATUS:</b> {t.estatus_tarea}</p>
                            <p><b>COMENTARIOS:</b> {t.comentarios_tarea}</p>
                            <p><b>F. INICIO:</b> {new Date(t.fecha_inicio).toISOString().split("T")[0]}</p>
                            <p><b>F. FIN:</b> {new Date(t.fecha_fin).toISOString().split("T")[0]}</p>
                            <p><b>PROYECTO:</b> {t.nombre_proyecto}</p>
                            <p><b>EMPLEADO:</b> {t.nombre_empleado}</p>
                        </div>
                        <button onClick={() => eliminarTarea(t.id_tarea)}>Eliminar</button>
                    </div>
                ))}
            </div>

        </div>
    )
}
