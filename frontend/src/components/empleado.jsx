import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./empleado.css";
import Barra_superior from './barra_superior';

export default function Empleado() {

    // FORMATO INICIAL DEL FORMULARIO
    const formatoInicial = {
        primer_nombre: "",
        segundo_nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        edad_empleado: "",
        telefono_empleado: "",
        correo_empleado: "",
        puesto_empleado: ""
    };

    //Constante para cargar la lista de empleados
    const [empleado, setEmpleado] = useState([]);
    //Constante para el formulario de crear empleado
    const [crearEmpleado, setCrearEmpleado] = useState(formatoInicial);
    //Constante para el formulario de actualizar empleado
    const [actualizarEmpleado, setActualizarEmpleado] = useState(formatoInicial);

    //Constantes para los modales que se utilizan para los formularios
    const [modalCrear, setModalCrear] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);

    // Cargar todos los empleados que hay
    useEffect(() => {
        axios.get("http://localhost:3001/empleado")
            .then(res => setEmpleado(res.data))
            .catch(err => console.error(err));
    }, []);

    // Guarda los datos conforme se vayan generando cambios en el formulario de creacion
    const handleChangeCrear = (e) => {
        const { name, value } = e.target;
        setCrearEmpleado(prev => ({ ...prev, [name]: value }));
    };

    // Guarda los datos conforme se vayan generando cambios en el formulario de actualizacion
    const handleChangeActualizar = (e) => {
        const { name, value } = e.target;
        setActualizarEmpleado(prev => ({ ...prev, [name]: value }));
    };

    // Metodo para mandar la solicitud de creacion del empleado
    const crearNuevoEmpleado = (e) => {
        e.preventDefault();

        //Extaremos los valores para las constantes y verificar que cumplan las caracteristicas especificadas
        const { edad_empleado, telefono_empleado, correo_empleado, puesto_empleado } = crearEmpleado;

        //Edad mínima
        if (edad_empleado < 18) {
            alert("La edad mínima es 18 años.");
            return;
        }

        //Validar teléfono EXACTAMENTE 10 dígitos
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(telefono_empleado)) {
            alert("El teléfono debe tener exactamente 10 dígitos numéricos.");
            return;
        }

        //Validar correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo_empleado)) {
            alert("El correo no es válido.");
            return;
        }

        if(puesto_empleado === "" || null){
            alert("Debe seleccionar un puesto para el empleado")
            return;
        }

        //Enviamos la solicitud con el metodo post
        axios.post("http://localhost:3001/empleado", crearEmpleado)
            .then(() => {
                alert("Empleado creado correctamente"); //Mensaje de registro exitoso
                setCrearEmpleado(formatoInicial); //Formateamos en blanco el formulario
                setModalCrear(false); //Cerramos el modal
                return axios.get("http://localhost:3001/empleado"); //Regresamos la lista de empleados actualizados
            })
            .then(res => setEmpleado(res.data)) //Insertamos los cambios en la lista que almacena los empleados
            .catch(err => console.error(err));
    };

    // Actualizar Empleado
    const enviarActualizar = (e) => {
        e.preventDefault();

        //Extaremos los valores para las constantes y verificar que cumplan las caracteristicas especificadas
        const { edad_empleado, telefono_empleado, correo_empleado, puesto_empleado } = actualizarEmpleado;

        //Edad mínima
        if (edad_empleado < 18) {
            alert("La edad mínima es 18 años.");
            return;
        }

        //Validar teléfono EXACTAMENTE 10 dígitos
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(telefono_empleado)) {
            alert("El teléfono debe tener exactamente 10 dígitos numéricos.");
            return;
        }

        //Validar correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo_empleado)) {
            alert("El correo no es válido.");
            return;
        }

         if(puesto_empleado === "" || null){
            alert("Debe seleccionar un puesto para el empleado")
            return;
        }

        //Enviamos la solicitud de actualizacion con el metodo put, donde pasamos el ID del empleado
        axios.put(`http://localhost:3001/empleado/${actualizarEmpleado.id_empleado}`, actualizarEmpleado)
            .then(res => {
                alert(res.data.message); //Obtenemos el mensaje de actualizacion exitosa
                setActualizarEmpleado({ ...formatoInicial, id_empleado: "" }); //Se limpia el formulario
                setModalActualizar(false); //Cerramos el modal del formulario
                return axios.get("http://localhost:3001/empleado"); //Retornamos la lista actualizada
            })
            .then(res => setEmpleado(res.data)) //Seteamos los datos en la constante que lista los empleados
            .catch(err => console.error(err));
    };

    // Selección del empleado para editar
    const handleSelectChange = (e) => {
        const id = e.target.value;

        //Extraemos el valor del ID que se obtiene del select en el formulario de actualizar
        const empleadoSeleccionado = empleado.find(emp => emp.id_empleado.toString() === id);

        //Rellenamos los datos con los campos con los que cuenta el ID
        if (empleadoSeleccionado) {
            setActualizarEmpleado({
                id_empleado: id,
                primer_nombre: empleadoSeleccionado.primer_nombre,
                segundo_nombre: empleadoSeleccionado.segundo_nombre,
                apellido_paterno: empleadoSeleccionado.apellido_paterno,
                apellido_materno: empleadoSeleccionado.apellido_materno,
                edad_empleado: empleadoSeleccionado.edad_empleado,
                telefono_empleado: empleadoSeleccionado.telefono_empleado,
                correo_empleado: empleadoSeleccionado.correo_empleado,
                puesto_empleado: empleadoSeleccionado.puesto_empleado
            });
        } else {
            setActualizarEmpleado(formatoInicial); //Si no selecciona un ID valido, formatea todo en blanco
        }
    };

    return (
        <div>
            <Barra_superior />
            <h3>EMPLEADOS</h3>
            
            {/*Botones para actualizar y crear un empleado*/}
            <div className='botones'>
                <button className="btn-abrir" onClick={() => setModalCrear(true)}>
                    CREAR EMPLEADO
                </button>

                <button className="btn-abrir" onClick={() => setModalActualizar(true)}>
                    ACTUALIZAR EMPLEADO
                </button>
            </div>

            {/* MODAL CREAR */}
            {modalCrear && (
                <div className="modal-fondo" onClick={() => setModalCrear(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <form className="form-empleado" onSubmit={crearNuevoEmpleado}>
                            <h2>Crear Empleado</h2>

                            <input type="text" name="primer_nombre" placeholder="Primer nombre"
                                value={crearEmpleado.primer_nombre} onChange={handleChangeCrear} required />

                            <input type="text" name="segundo_nombre" placeholder="Segundo nombre"
                                value={crearEmpleado.segundo_nombre} onChange={handleChangeCrear} />

                            <input type="text" name="apellido_paterno" placeholder="Apellido paterno"
                                value={crearEmpleado.apellido_paterno} onChange={handleChangeCrear} required />

                            <input type="text" name="apellido_materno" placeholder="Apellido materno"
                                value={crearEmpleado.apellido_materno} onChange={handleChangeCrear} />

                            <input type="number" name="edad_empleado" placeholder="Edad"
                                value={crearEmpleado.edad_empleado} onChange={handleChangeCrear}
                                onKeyDown={(e) => { //Regla de validacion para los campos numericos
                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                required />

                            <input type="text" name="telefono_empleado" placeholder="Teléfono" maxLength={10}
                                value={crearEmpleado.telefono_empleado} onChange={handleChangeCrear} required />

                            <input type="email" name="correo_empleado" placeholder="Correo"
                                value={crearEmpleado.correo_empleado} onChange={handleChangeCrear} required />

                            <select
                                name="puesto_empleado"
                                value={crearEmpleado.puesto_empleado}
                                onChange={handleChangeCrear}
                                required
                            >
                                <option value="">--SELECCIONA UN PUESTO--</option>
                                <option value="Diseñador">Diseñador</option>
                                <option value="Programador">Programador</option>
                                <option value="Coordinador">Coordinador</option>
                                <option value="Supervisor">Supervisor</option>
                            </select>

                            <button className="btn-accion" type="submit">Guardar</button>
                            <button className="cerrar" onClick={() => setModalCrear(false)}>Cerrar</button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ACTUALIZAR */}
            {modalActualizar && (
                <div className="modal-fondo" onClick={() => setModalActualizar(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Actualizar Empleado</h2>

                        <p>Selecciona el empleado:</p>
                        <select value={actualizarEmpleado.id_empleado} onChange={handleSelectChange}>
                            <option value="">--SELECCIONA UN EMPLEADO--</option>
                            {empleado.map(emp => ( //Extaremos cada empleado y de ellos ciertos atributos para listar
                                <option key={emp.id_empleado} value={emp.id_empleado}>
                                    {emp.id_empleado} - {emp.primer_nombre} {emp.apellido_paterno}
                                </option>
                            ))}
                        </select>

                        <form className="form-empleado" onSubmit={enviarActualizar}>

                            <input type="text" name="primer_nombre"
                                value={actualizarEmpleado.primer_nombre}
                                onChange={handleChangeActualizar} required />

                            <input type="text" name="segundo_nombre"
                                value={actualizarEmpleado.segundo_nombre}
                                onChange={handleChangeActualizar} />

                            <input type="text" name="apellido_paterno"
                                value={actualizarEmpleado.apellido_paterno}
                                onChange={handleChangeActualizar} required />

                            <input type="text" name="apellido_materno"
                                value={actualizarEmpleado.apellido_materno}
                                onChange={handleChangeActualizar} />

                            <input type="number" name="edad_empleado"
                                value={actualizarEmpleado.edad_empleado}
                                onChange={handleChangeActualizar} required
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />

                            <input type="text" name="telefono_empleado" maxLength={10}
                                value={actualizarEmpleado.telefono_empleado}
                                onChange={handleChangeActualizar} required />

                            <input type="email" name="correo_empleado"
                                value={actualizarEmpleado.correo_empleado}
                                onChange={handleChangeActualizar} required />

                            <select
                                name="puesto_empleado"
                                value={actualizarEmpleado.puesto_empleado}
                                onChange={handleChangeActualizar}
                                required
                            >
                                <option value="">-- Selecciona un puesto --</option>
                                <option value="Diseñador">Diseñador</option>
                                <option value="Programador">Programador</option>
                                <option value="Coordinador">Coordinador</option>
                                <option value="Supervisor">Supervisor</option>
                            </select>

                            <button className="btn-accion" type="submit">Actualizar</button>
                            <button className="cerrar" onClick={() => setModalActualizar(false)}>Cerrar</button>

                        </form>
                    </div>
                </div>
            )}

            {/* LISTA DE EMPLEADOS */}
            <div className='contenedor-empleado'>
                {empleado.map(e => (
                    <div className='empleado' key={e.id_empleado}>
                        <h3>{e.primer_nombre} {e.segundo_nombre} {e.apellido_paterno} {e.apellido_materno}</h3>
                        <p><b>ID:</b> {e.id_empleado}</p>
                        <p><b>Edad:</b> {e.edad_empleado}</p>
                        <p><b>Teléfono:</b> {e.telefono_empleado}</p>
                        <p><b>Correo:</b> {e.correo_empleado}</p>
                        <p><b>Puesto:</b> {e.puesto_empleado}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}