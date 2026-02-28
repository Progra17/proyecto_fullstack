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

    const [empleado, setEmpleado] = useState([]);
    const [crearEmpleado, setCrearEmpleado] = useState(formatoInicial);
    const [actualizarEmpleado, setActualizarEmpleado] = useState(formatoInicial);

    const [modalCrear, setModalCrear] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);

    // Cargar empleados
    useEffect(() => {
        axios.get("http://localhost:3001/empleado")
            .then(res => setEmpleado(res.data))
            .catch(err => console.error(err));
    }, []);

    // Cambios para crear
    const handleChangeCrear = (e) => {
        const { name, value } = e.target;
        setCrearEmpleado(prev => ({ ...prev, [name]: value }));
    };

    // Cambios para actualizar
    const handleChangeActualizar = (e) => {
        const { name, value } = e.target;
        setActualizarEmpleado(prev => ({ ...prev, [name]: value }));
    };

    // Crear Empleado
    const crearNuevoEmpleado = (e) => {
        e.preventDefault();

        axios.post("http://localhost:3001/empleado", crearEmpleado)
            .then(() => {
                alert("Empleado creado correctamente");
                setCrearEmpleado(formatoInicial);
                setModalCrear(false);
                return axios.get("http://localhost:3001/empleado");
            })
            .then(res => setEmpleado(res.data))
            .catch(err => console.error(err));
    };

    // Actualizar Empleado
    const enviarActualizar = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/empleado/${actualizarEmpleado.id_empleado}`, actualizarEmpleado)
            .then(res => {
                alert(res.data.message);
                setActualizarEmpleado({ ...formatoInicial, id_empleado: "" });
                setModalActualizar(false);
                return axios.get("http://localhost:3001/empleado");
            })
            .then(res => setEmpleado(res.data))
            .catch(err => console.error(err));
    };

    // Selección del empleado para editar
    const handleSelectChange = (e) => {
        const id = e.target.value;

        const empleadoSeleccionado = empleado.find(emp => emp.id_empleado.toString() === id);

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
            setActualizarEmpleado(formatoInicial);
        }
    };

    return (
        <div>
            <Barra_superior />
            <h3>EMPLEADOS</h3>

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
                                value={crearEmpleado.edad_empleado} onChange={handleChangeCrear} required />

                            <input type="text" name="telefono_empleado" placeholder="Teléfono"
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
                            {empleado.map(emp => (
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
                                onChange={handleChangeActualizar}  />

                            <input type="number" name="edad_empleado"
                                value={actualizarEmpleado.edad_empleado}
                                onChange={handleChangeActualizar} required />

                            <input type="text" name="telefono_empleado"
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
                        <h3>{e.primer_nombre} {e.apellido_paterno}</h3>
                        <p><b>ID:</b> {e.id_empleado}</p>
                        <p><b>Segundo nombre:</b> {e.segundo_nombre}</p>
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