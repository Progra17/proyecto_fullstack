import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./proyecto.css"
import Barra_superior from './barra_superior';


export default function Proyecto() {

    // Valores iniciales del formulario
    const formatoInicial = {
        nombre_proyecto: "",
        descripcion_proyecto: "",
        estado_proyecto: "",
        fecha_inicio: "",
        fecha_fin: ""
    };

    //Constante para cargar la lista de proyectos
    const [proyecto, setProyecto] = useState([]);
    //Constante para el formulario de crear proyecto
    const [crearProyecto, setCrearProyecto] = useState(formatoInicial);
    //Constante para el formulario de actualizar proyecto
    const [actualizarProyecto, setActualizarProyecto] = useState(formatoInicial);

    //Constantes para los modales que se utilizan para los formularios
    const [modalCrear, setModalCrear] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);

    // Cargamos todos los proyectos que hay
    useEffect(() => { //Se ejecuta cada que se renderiza
        axios.get("http://localhost:3001/proyecto") //Se hace la peticion al servidor
            .then(res => setProyecto(res.data)) //Con setNotas se almacena el contendio
            .catch(err => console.error(err));
    }, []);

    // Guarda los datos conforme se vayan generando cambios en el formulario de creacion
    const handleChangeCrear = (e) => {
        const { name, value } = e.target;
        setCrearProyecto(prev => ({ ...prev, [name]: value }));
    };

    // Guarda los datos conforme se vayan generando cambios en el formulario de actualizacion
    const handleChangeActualizar = (e) => {
        const { name, value } = e.target;
        setActualizarProyecto(prev => ({ ...prev, [name]: value }));
    };

    //Enviamos la solicitud con el metodo post
    const crearNuevoProyecto = (e) => {
        e.preventDefault();

        axios.post("http://localhost:3001/proyecto", crearProyecto)
            .then(() => {
                alert("Proyecto creado correctamente"); //Mensaje de registro exitoso
                setCrearProyecto(formatoInicial); //Formateamos en blanco el formulario
                setModalCrear(false); //Cerramos el modal
                return axios.get("http://localhost:3001/proyecto"); //Retornamos la lista actualizada
            })
            //Mostramos las tareas actualizadas
            .then(res => setProyecto(res.data))
            .catch(err => console.error(err));
    };

    //Enviar solicitud de actualizacion al servidor
    const enviarActualizar = (e) => {
        e.preventDefault();

        //Enviamos la solicitud de actualizacion con el metodo put, donde pasamos el ID del proyecto
        axios.put(`http://localhost:3001/proyecto/${actualizarProyecto.id_proyecto}`, actualizarProyecto)
            .then(res => {
                alert(res.data.message);
                setActualizarProyecto({ ...formatoInicial, id_proyecto: "" });
                setModalActualizar(false);
                return axios.get("http://localhost:3001/proyecto");
            })
            .then(res => setProyecto(res.data))
            .catch(err => console.error(err));
    };

    //Permite manejar la seleccion de IDs para ACTUALIZAR EL PROYECTO
    const handleSelectChange = (e) => {
        const id = e.target.value;
        
        //Extraemos el valor del ID que se obtiene del select en el formulario de actualizar
        const proyectoSeleccionado = proyecto.find(p => p.id_proyecto.toString() === id);

        //Rellenamos los datos con los campos con los que cuenta el ID
        if (proyectoSeleccionado) {
            setActualizarProyecto({
                id_proyecto: id,
                nombre_proyecto: proyectoSeleccionado.nombre_proyecto,
                descripcion_proyecto: proyectoSeleccionado.descripcion_proyecto,
                estado_proyecto: proyectoSeleccionado.estado_proyecto,
                fecha_inicio: proyectoSeleccionado.fecha_inicio.split("T")[0],
                fecha_fin: proyectoSeleccionado.fecha_fin.split("T")[0],
            });
        } else {
            setActualizarProyecto(formatoInicial); // si selecciona "--Selecciona un proyecto"
        }
    };

    return (
        <div>
            <Barra_superior />

            <h3>PROYECTOS</h3>

            {/*Botones para actualizar y crear un proyecto*/}
            <div className='botones'>
                <button className="btn-abrir" onClick={() => setModalCrear(true)}>
                    CREAR PROYECTO
                </button>

                <button className="btn-abrir" onClick={() => setModalActualizar(true)}>
                    ACTUALIZAR PROYECTO
                </button>
            </div>

            {modalCrear && (
                <div className="modal-fondo" onClick={() => setModalCrear(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <form className="form-proyecto" onSubmit={crearNuevoProyecto}>

                            <h2>Crear Proyecto</h2>

                            <input
                                type="text"
                                name="nombre_proyecto"
                                placeholder="Nombre del proyecto"
                                value={crearProyecto.nombre_proyecto}
                                onChange={handleChangeCrear}
                                required
                            />

                            <input
                                type="text"
                                name="descripcion_proyecto"
                                placeholder="Descripción"
                                value={crearProyecto.descripcion_proyecto}
                                onChange={handleChangeCrear}
                                required
                            />

                            <select
                                name="estado_proyecto"
                                value={crearProyecto.estado_proyecto}
                                onChange={handleChangeCrear}
                                required
                            >
                                <option value="Pendiente de aprobación">Pendiente de aprobación</option>
                                <option value="En proceso">En proceso</option>
                                <option value="En pruebas">En pruebas</option>
                                <option value="Finalizado">Finalizado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>

                            <input
                                type="date"
                                name="fecha_inicio"
                                value={crearProyecto.fecha_inicio}
                                onChange={handleChangeCrear}
                                required
                            />

                            <input
                                type="date"
                                name="fecha_fin"
                                value={crearProyecto.fecha_fin}
                                onChange={handleChangeCrear}
                                required
                            />

                            <button className="btn-accion" type="submit">Guardar</button>
                            <button className="cerrar" onClick={() => setModalCrear(false)}>Cerrar</button>

                        </form>
                    </div>
                </div>
            )}

            {modalActualizar && (
                <div className="modal-fondo" onClick={() => setModalCrear(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>ACTUALIZAR PROYECTO</h2>

                        <p>SELECCIONA EL PROYECTO:</p>
                        <select //Extaremos cada proyecto y de ellos ciertos atributos para listar
                            value={actualizarProyecto.id_proyecto} onChange={handleSelectChange}>
                            <option value="">--SELECCIONA UN PROYECTO--</option>
                            {proyecto.map(p => (
                                <option key={p.id_proyecto} value={p.id_proyecto}>
                                    {p.id_proyecto} - {p.nombre_proyecto}
                                </option>
                            ))}
                        </select>

                        <form className="form-proyecto" onSubmit={enviarActualizar}>

                            <input
                                type="text"
                                name="nombre_proyecto"
                                placeholder="Nombre del proyecto"
                                value={actualizarProyecto.nombre_proyecto}
                                onChange={handleChangeActualizar}
                                required
                            />

                            <input
                                type="text"
                                name="descripcion_proyecto"
                                placeholder="Descripción"
                                value={actualizarProyecto.descripcion_proyecto}
                                onChange={handleChangeActualizar}
                                required
                            />

                            <select
                                name="estado_proyecto"
                                value={actualizarProyecto.estado_proyecto}
                                onChange={handleChangeActualizar}
                            >
                                <option value="Pendiente de aprobación">Pendiente de aprobación</option>
                                <option value="En proceso">En proceso</option>
                                <option value="En pruebas">En pruebas</option>
                                <option value="Finalizado">Finalizado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>

                            <input
                                type="date"
                                name="fecha_inicio"
                                value={actualizarProyecto.fecha_inicio}
                                onChange={handleChangeActualizar}
                            />

                            <input
                                type="date"
                                name="fecha_fin"
                                value={actualizarProyecto.fecha_fin}
                                onChange={handleChangeActualizar}
                            />

                            <button className="btn-accion" type="submit">Actualizar</button>
                            <button className="cerrar" onClick={() => setModalActualizar(false)}>Cerrar</button>

                        </form>
                    </div>
                </div>
            )}

            
            {/*LISTA DE PROYECTOS*/}
            <div className='contenedor-proyecto'>
                {proyecto.map(p => (
                    <div className='proyecto' key={p.id_proyecto}>
                        <h3>{p.nombre_proyecto}</h3>
                        <p><b>ID:</b> {p.id_proyecto}</p>
                        <p><b>DESCRIPCIÓN:</b> {p.descripcion_proyecto}</p>
                        <p><b>ESTADO:</b> {p.estado_proyecto}</p>
                        <p><b>FECHA DE INCIO:</b> {new Date(p.fecha_inicio).toISOString().split("T")[0]}</p>
                        <p><b>FECHA DE FIN:</b> {new Date(p.fecha_fin).toISOString().split("T")[0]}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
