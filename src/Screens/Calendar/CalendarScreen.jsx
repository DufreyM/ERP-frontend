import { useRef, useState,useEffect,   } from 'react';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es';
import { useOutletContext } from 'react-router-dom';
import { faPen, faTag, faCalendar, faCalendarDay, faHourglassStart, faUser, faArrowLeft,faClipboardList, faAngleLeft, faAngleRight, faClock, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import SimpleTitle from '../../components/Titles/SimpleTitle'
import "./CalendarScreen.css"
import { useFetch } from "../../utils/useFetch";
import Popup from '../../components/Popup/Popup';
import InputDates from '../../components/Inputs/InputDates';
import IconoInput from '../../components/Inputs/InputIcono';
import InputSelects from '../../components/Inputs/InputSelects';
import { getOptions } from '../../utils/selects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getToken } from '../../services/authService';
import EventoCard from './EventoCard/EventoCard';

export const CalendarScreen= () =>{

    //crear el calendario y manejar su adaptabilidad al tamaño
    const { rightPanelCollapsed } = useOutletContext();
    const [currentTitle, setCurrentTitle] = useState('');
    const calendarRef = useRef(null);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            const api = calendarRef.current?.getApi();
            if (api) api.updateSize();
        }, 500); 

        return () => clearTimeout(timeout);
    }, [rightPanelCollapsed]);


    //Obtener datos de la base de datos
    const token = getToken();
    const { selectedLocal } = useOutletContext();
    const localSeleccionado = selectedLocal + 1 ;
    const url = `http://localhost:3000/api/calendario?local_id=${localSeleccionado}`;

    const { data, loading, error } = useFetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });


    useEffect(() => {
        if (data) {
            const eventosConvertidos = data.map(evento => ({
            id: evento.id,
            title: evento.titulo,
            start: evento.fecha,
            extendedProps: {
                descripcion: evento.detalles,
                raw: evento, // opcional para editar después
            }
            }));

            setEvents(eventosConvertidos);
        }
    }, [data]);



    //opciones de Tipo de recordatorio
    const [errorMessage, setErrorMessage] = useState('');
    const [tipoRecordatorio, setTipoRecordatorio] = useState('');
    const [opcionesTipoRecordatorio, setOpcionesTipoRecordatorio] = useState([]);
    useEffect(() => {
            getOptions("http://localhost:3000/api/calendario/tipos-evento", item => ({
                value: item.id, //cambiar babosada aca
                label: item.nombre,
            })).then(setOpcionesTipoRecordatorio);
    }, []);

    //opciones de estado del recordatorio
    const [estadoRecordatorio, setEstadoRecordatorio] = useState('');
    const [opcionesEstados, setOpcionesEstados] = useState([]);
    useEffect(() => {
            getOptions("http://localhost:3000/api/calendario/estados", item => ({
                value: item.id,
                label: item.nombre,
            })).then(setOpcionesEstados);
    
        }, []);

    //opciones de Visitadores medicos
    const [visitador, setVisitador] = useState('');
    const [opcionesVisitadores, setOpcionesVisitadores] = useState([]);
    useEffect(() => {
            getOptions(`http://localhost:3000/api/visitadores-medicos/por-local/${localSeleccionado}`, item => ({
                value: item.id,
                label: `${item.nombre}`,
            })).then(setOpcionesVisitadores);
    
        }, [localSeleccionado]);


    //Variables de datos y formularios
    const [nombreEvento, setNombreEvento] = useState('');
    const [fechaEvento, setFechaEvento] = useState(null);
    const [horaEvento, setHoraEvento] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const handleNombreEvento = (e) => {
        setNombreEvento(e.target.value);
        setErrorMessage('');
    };

    const handleHoraEvento = (e) => {
        const value = e.target.value;

        setHoraEvento(e.target.value);
         if (/^\d{0,2}(:\d{0,2})?$/.test(value)) {
            setHoraEvento(value);
            setErrorMessage('');
        }
    };

    const handleDescripcion = (e) => {
        setDescripcion(e.target.value);
        setErrorMessage('');
    };

    const handleVisitador = (e) => {
        setVisitador(e.target.value);
        setErrorMessage('');
    };

    const handleTipoEvento = (e) => {
        setTipoRecordatorio(e.target.value);
        setErrorMessage('');
    };

    const handleEstadoEvento = (e) => {
        setEstadoRecordatorio(e.target.value);
        setErrorMessage('');
    };

    const handleDate = (date) => {
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setErrorMessage("No puedes seleccionar una fecha pasada.");
            return;
        }
        setErrorMessage(""); // Limpia el mensaje si todo está bien
        setFechaEvento(date);
    
    };


    //activar el select de visitadores medicos si se selecciona esa opcion
    const [selectVisitadores, setSelectVisitadores] = useState(false);
    useEffect(() => {
        const newState = tipoRecordatorio === "1";

        if (selectVisitadores !== newState) {
            setSelectVisitadores(newState); 
        }
    }, [tipoRecordatorio]);


    function combinarFechaYHora(fecha, hora) {
        if (!fecha || !hora) return null;

        const [horaStr, minutoStr] = hora.split(':');
        const fechaFinal = new Date(fecha);
        fechaFinal.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);
        return fechaFinal.toISOString(); // formato ISO 8601

    }


    //notificacion
    const [notificacion, setNotificacion] = useState('');
    useEffect(() => {
        if (notificacion) {
            const timer = setTimeout(() => {
            setNotificacion('');
            }, 2500); // se quita en 2.5 segundos

            return () => clearTimeout(timer);
        }
    }, [notificacion]);


    //popUp Nuevo evento
    const [nuevoEvento, setNuevoEvento] = useState(false);
    const openNuevoEvento = () => setNuevoEvento(true);
    const closeNuevoEvento = () => setNuevoEvento(false);


    const crearEvento = async (token, datosEvento) => {
        const response = await fetch('http://localhost:3000/api/calendario', {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosEvento)
        });

        if (!response.ok) {
            const mensaje = await response.text(); // para depurar errores de backend
            throw new Error(`Error ${response.status}: ${mensaje}`);
        }

        return await response.json();
    };

    const handleCrearEvento = async () => {
        setErrorMessage('');
        if (!nombreEvento.trim() || !fechaEvento || !horaEvento  || !tipoRecordatorio) {
            setErrorMessage('Por favor, completa todos los campos obligatorios.');
            return;
        }

        if (selectVisitadores && !visitador) {
            setErrorMessage('Debes seleccionar un visitador médico.');
            return;
        }

        const tokenActual = token; // Reemplaza con el real
        const fechaISO = combinarFechaYHora(fechaEvento, horaEvento);

        const datosEvento = {
            titulo: nombreEvento,
            tipo_evento_id: parseInt(tipoRecordatorio, 10),
            estado_id: 2,
            fecha: fechaISO,
            visitador_id: selectVisitadores ? parseInt(visitador) : null,
            detalles: descripcion,
            local_id: localSeleccionado
        };
        console.log('estoy mandando:', datosEvento);

        try {
            const respuesta = await crearEvento(tokenActual, datosEvento);
            closeNuevoEvento();
            setNotificacion('Evento creado con éxito');
            console.log('Evento creado:', respuesta);
            // Puedes cerrar el modal o mostrar una notificación aquí
        } catch (error) {
            console.error('Error al crear evento:', error);
            setErrorMessage('Ocurrió un error al crear el evento. Intenta nuevamente.');
        }
    };


    //Editar un evento
    const [eventoAEditar, setEventoAEditar] = useState(null);
    const [editarEvento, setEditarEvento] = useState(false);
    const openEditarEvento = () => setEditarEvento(true);
    const closeEditarEvento = () => setEditarEvento(false);

    function obtenerHoraDesdeFecha(fechaISO) {
        if (!fechaISO) return '';

        const fecha = new Date(fechaISO);
        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        return `${horas}:${minutos}`;
    }


    const cargarDatosEventoEnFormulario = (evento) => {
        const tipoId = evento.tipo_evento_id?.toString();
        setNombreEvento(evento.titulo);
        setTipoRecordatorio(tipoId);
        setEstadoRecordatorio(evento.estado_id?.toString());
        setVisitador(evento.visitador?.id?.toString() || '');
        setFechaEvento(new Date(evento.fecha));
        setHoraEvento(obtenerHoraDesdeFecha(evento.fecha));
        setDescripcion(evento.detalles);

        // pa que actualice 
        setTimeout(() => {
            if (tipoId === '1') {
                setSelectVisitadores(true);
            } else {
                setSelectVisitadores(false);
            }
        }, 0); // incluso con 0ms ya es suficiente
    };


    const actualizarEvento = async (idEvento, token, datosActualizados) => {
        const response = await fetch(`http://localhost:3000/api/calendario/${idEvento}`, {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!response.ok) {
            const mensaje = await response.text();
            throw new Error(`Error ${response.status}: ${mensaje}`);
        }

        return await response.json();
    };

    const handleEditarEvento = async () => {
        if (!eventoAEditar) return;
        const fechaISO = combinarFechaYHora(fechaEvento, horaEvento);

        const tokenActual = token;

        const datos = {
            titulo: nombreEvento,
            tipo_evento_id: parseInt(tipoRecordatorio, 10),
            estado_id: parseInt(estadoRecordatorio, 10),
            visitador_id: selectVisitadores ? parseInt(visitador) : null,
            fecha: fechaISO,
            detalles: descripcion
        };


        try {
            const respuesta = await actualizarEvento(eventoAEditar, tokenActual, datos);
            console.log("Evento actualizado:", respuesta);
            setNotificacion("Evento actualizado con éxito");
            closeEditarEvento();
        } catch (error) {
            console.error("Error al actualizar evento:", error);
            setErrorMessage("No se pudo actualizar el evento.");
        }
    };

    //eliminar un evento
    const [eliminarEvento, setEliminarEvento] = useState(false);
    const openEliminarEvento = () => setEliminarEvento(true);
    const closeEliminarEvento = () => setEliminarEvento(false);
    const [eventoAEliminar, setEventoAEliminar] = useState(null);

    const HandleEliminarEvento = async () => {
    if (!eventoAEliminar) {
        console.log("No se ha seleccionado un evento para eliminar.");
        return; // Asegurarse de que haya un evento seleccionado
    }

    const token = getToken(); // Asegúrate de obtener el token correctamente

    try {
      
        const response = await fetch(`http://localhost:3000/api/calendario/${eventoAEliminar}/marcar-eliminado`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const mensaje = await response.text();
            throw new Error(`Error ${response.status}: ${mensaje}`);
        }

        // Eliminar el evento del estado
        setEvents((prevEvents) => prevEvents.filter((evento) => evento.id !== eventoAEliminar));

        setNotificacion("Evento eliminado con éxito");
        closeEliminarEvento(); // Cerrar el modal
    } catch (error) {
        setErrorMessage(`No se pudo eliminar el evento. ${error.message}`);
    }
};

    const onDeleteEvent = (eventoId) => {
        if (!eventoId) {
            console.error("No se proporcionó un ID de evento válido.");
            return; // Salir si no hay ID válido
        }

        setEventoAEliminar(eventoId); // Guardar el ID del evento a eliminar
        openEliminarEvento(); // Abrir el pop-up para confirmar
    };

    const obtenerDiaHoy = () => {
        const hoy = new Date(); // Obtén la fecha de hoy
        const opciones = { weekday: 'long', day: 'numeric' }; // Formato: Día de la semana, Día del mes
        const fechaFormateada = hoy.toLocaleDateString('es-ES', opciones); // 'es-ES' para español
        return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1); // Capitalizar la primera letra
    }

    const handleVolver = () => {
        setSelectedEvent(null); // Volver al listado
    };

    const renderEventContent = (eventInfo) => {
        const tipoEventoId = eventInfo.event.extendedProps?.raw?.tipo_evento_id;

        const tipoEvento = opcionesTipoRecordatorio.find(
            tipo => tipo.value === tipoEventoId
        )?.label || null;

        return (
            <div className='eventoEnCalendario'>
                <b>{tipoEvento}</b>
            </div>
        );
    };




    const [selectedEvent, setSelectedEvent] = useState(null);


    const handlePrev = () => calendarRef.current.getApi().prev();
    const handleNext = () => calendarRef.current.getApi().next();
    const handleToday = () => calendarRef.current.getApi().today();

    const [events, setEvents] = useState([]);



    if (loading) {
        return <div>Cargando eventos...</div>;
    }

    if (error) {
        return <div>Error al cargar los eventos: {error.message}</div>;
    }

    if (!data || data.length === 0) {
        return <div>No hay eventos disponibles.</div>;
    }


    //detalles esteticos
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const finSemana = new Date(hoy);
    finSemana.setDate(hoy.getDate() + 6);

    const eventosDeHoy = data.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        fechaEvento.setHours(0, 0, 0, 0);
        return fechaEvento.getTime() === hoy.getTime();
    });

    const eventosDeLaSemana = data.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        fechaEvento.setHours(0, 0, 0, 0);
        return fechaEvento > hoy && fechaEvento <= finSemana;
    });




  return (
    
    <div className='pantallaCalendario'>
        {notificacion && (
            <div className="toast">
                {notificacion}
            </div>
        )}

        <button className= 'buttonCalendarDay' onClick={handleToday}>
            <FontAwesomeIcon icon = {faCalendarDay} style={{fontSize: '25px'}}/>
        </button>



        <div className='tituloyCalendario'>
            <div className='titleDiv'>
                <SimpleTitle text = "Calendario de actividades"/>
            </div>


            <div className='allTitle'>

                
                <div className='encabezadoMesStyle'>
                    <button className= 'buttonCalendarRow' onClick={handlePrev}>
                        <FontAwesomeIcon icon = {faAngleLeft} style={{fontSize: '25px'}}/>
                    </button>
                    <h3 className='tituloMes'>{currentTitle}</h3>
                    <button className= 'buttonCalendarRow'onClick={handleNext}>
                        <FontAwesomeIcon icon = {faAngleRight} style={{fontSize: '25px'}}/>
                    </button>
                
                </div>
                
            </div>
            


            <div className='contenedorCalendario' >
                <FullCalendar
                    headerToolbar={false}
                    ref={calendarRef}
                    datesSet={(arg) => setCurrentTitle(arg.view.title)}
                    locales = {[esLocale]}
                    locale = "es"
                    className='calendario'
                    plugins={[ dayGridPlugin ]}
                    initialView="dayGridMonth"
                    weekends={true}                               
                    eventClick={(info) => {
                        setSelectedEvent(info.event);
                    }}
                    events = {events}  
                    eventContent={renderEventContent}
                
                />  
            </div>

            
        </div>



        
            

        <div className='contentLeft'>
            <div className='contentLeft2'>

            <div className='divbuttons'>

                <button className= 'buttontitletoday' onClick={handleToday}>
                     <h2 className='diaHoy'>{obtenerDiaHoy()}</h2>
                </button>

               
                <button className= 'buttonCalendarRow' onClick={openNuevoEvento}>
                    <FontAwesomeIcon icon = {faPlusCircle} style={{fontSize: '25px'}}/>
                </button>
            </div>
            

            
            <div className='descripcionStyle'>
                
            <div className='event-details'>
                {selectedEvent ? (
                    <>
                        <h4 className="subtitulo">Evento:</h4>
                        <div className = 'Eventos' key={selectedEvent.id}>
                            <EventoCard
                                key={selectedEvent.id}
                                id={selectedEvent.id}
                                title={selectedEvent.title}
                                descripcion={selectedEvent.extendedProps.descripcion}
                                date={selectedEvent.start}
                                estado={selectedEvent.extendedProps.raw?.estado?.nombre}
                                tipo={
                                    opcionesTipoRecordatorio.find(
                                        tipo => tipo.value === selectedEvent.extendedProps.raw?.tipo_evento_id
                                    )?.label || null
                                }
                                visitador={
                                    opcionesVisitadores.find(
                                        v => v.value === selectedEvent.extendedProps.raw?.visitador_id
                                    )?.label || null
                                }
                                onEdit={() => {
                                    cargarDatosEventoEnFormulario(selectedEvent.extendedProps.raw);
                                    setEventoAEditar(selectedEvent.id);
                                    openEditarEvento();
                                }}
                                onDelete={() => onDeleteEvent(selectedEvent.id)}
                                expandirInicial={true} // se muestra ya desplegado
                            />
                        </div>
                        <button className='buttonCalendarRow' onClick={() => setSelectedEvent(null)}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Volver
                        </button>
                            
                      
                    </>
                ) : (
                <>
                    
                    <h4 className="subtitulo">Eventos de hoy</h4>
                    {eventosDeHoy.length > 0 ? (
                        eventosDeHoy.map((evento) => {
                            const tipoEvento = opcionesTipoRecordatorio.find(tipo => tipo.value === evento.tipo_evento_id)?.label || null;
                            const nombreVisitador = opcionesVisitadores.find(visitador => visitador.value === evento.visitador_id)?.label || null;
                            return (
                                <div className = 'Eventos'>
                                <EventoCard
                                    key={evento.id}
                                    id={evento.id}
                                    title={evento.titulo}
                                    descripcion={evento.detalles}
                                    date={evento.fecha}
                                    estado={evento.estado?.nombre}
                                    tipo={tipoEvento}
                                    local={evento.local}
                                    usuario={evento.usuario}
                                    visitador={nombreVisitador}
                                    onEdit={() => {
                                        cargarDatosEventoEnFormulario(evento);
                                        setEventoAEditar(evento.id);
                                        openEditarEvento();
                                    }}
                                    onDelete={() => onDeleteEvent(evento.id)}
                                />
                                </div>
                            );
                        })
                    ) : (
                        <p style={{color:"#5a60A5"}}>No hay eventos para hoy.</p>
                    )}

                    <h4 className="subtitulo">Resto de la semana</h4>
                    {eventosDeLaSemana.length > 0 ? (
                        eventosDeLaSemana.map((evento) => {
                            const tipoEvento = opcionesTipoRecordatorio.find(tipo => tipo.value === evento.tipo_evento_id)?.label || null;
                            const nombreVisitador = opcionesVisitadores.find(visitador => visitador.value === evento.visitador_id)?.label || null;
                            return (
                                <div className = 'Eventos'>
                                <EventoCard
                                    key={evento.id}
                                    id={evento.id}
                                    title={evento.titulo}
                                    descripcion={evento.detalles}
                                    date={evento.fecha}
                                    estado={evento.estado?.nombre}
                                    tipo={tipoEvento}
                                    local={evento.local}
                                    usuario={evento.usuario}
                                    visitador={nombreVisitador}
                                    onEdit={() => {
                                        cargarDatosEventoEnFormulario(evento);
                                        setEventoAEditar(evento.id);
                                        openEditarEvento();
                                    }}
                                    onDelete={() => onDeleteEvent(evento.id)}
                                />
                                </div>
                            );
                        })
                    ) : (
                        <p style={{color:"#5a60A5"}}>No hay más eventos esta semana.</p>
                    )}
                </>
            )}

                   



             


            </div>
            </div>
        </div>            
    </div>
      

        
        {/* Pop up para un nuevo evento*/}
            {<Popup 
       
                isOpen={eliminarEvento} 
                onClose={closeEliminarEvento}
                title={'Eliminar un recordatorio'}
                onClick={HandleEliminarEvento}
            
            >
                <div className='modalContenido'>
                    {errorMessage && (
                        <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
                    )}
                </div>

            </Popup>
        
            }




        {/* Pop up para un nuevo evento*/}
            {<Popup 
            key={selectVisitadores}
                isOpen={nuevoEvento} 
                onClose={closeNuevoEvento}
                title={'Crear un nuevo recordatorio'}
                onClick={handleCrearEvento}
            
            >
                <div className='modalContenido'>

                    <IconoInput
                        icono = {faPen}
                        placeholder = {"Nombre del recordatorio"}
                        value = {nombreEvento}
                        onChange = {handleNombreEvento}
                        type = "text"
                        error={!!errorMessage}
                        name = ""
                    
                    ></IconoInput>


                    <InputSelects
                        icono = {faTag}
                        placeholder = {"Seleccione el tipo de recordatorio"}
                        value = {tipoRecordatorio}
                        opcions = {opcionesTipoRecordatorio}
                        onChange = {handleTipoEvento}
                        type = "text"
                        name = ""
                        error={!!errorMessage}
                    />
                    
                    {/* solo se muestra si es seleccionado */}
                    {selectVisitadores && (
                        <InputSelects
                            icono = {faUser}
                            placeholder = {"Seleccione el visitador medico"}
                            value = {visitador}
                            onChange = {handleVisitador}
                            type = "text"        
                            name = ""
                            error={!!errorMessage}
                            opcions = {opcionesVisitadores}
                        />
                    )}
                        
                    <InputDates
                        icono = {faCalendar}
                        placeholder = {"Fecha del recordatorio"}
                        onChange = {handleDate}
                        selected = {fechaEvento}
                        minDate={new Date()}
                        error={!!errorMessage}
                    ></InputDates>

                    <IconoInput
                        icono = {faClock}
                        placeholder = {"Seleccione la hora"}
                        value = {horaEvento}
                        onChange = {handleHoraEvento}
                        type = "time"
                        error={!!errorMessage}
                        name = ""
                    
                    ></IconoInput>

                    <IconoInput
                        icono = {faClipboardList}
                        placeholder = {"Agregar descripción"}
                        value = {descripcion}
                        onChange = {handleDescripcion}
                        type = "text"
                        name = ""
                        error={!!errorMessage}
                    ></IconoInput>

                    {errorMessage && (
                        <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
                    )}
  
                    
                    
                </div>

            </Popup>
        
            }

            
        {/* Pop up para editar unevento*/}
            {<Popup 

                isOpen={editarEvento} 
                onClose={closeEditarEvento}
                onClick={handleEditarEvento}
                title={'Editar un recordatorio'}
            
            >
                <div className='modalContenido'>

                    <IconoInput
                        icono = {faPen}
                        placeholder = {"Nombre del recordatorio"}
                        value = {nombreEvento}
                        onChange = {handleNombreEvento}
                        type = "text"
                        error={!!errorMessage}
                        
                        name = ""
                    
                    ></IconoInput>


                    <InputSelects
                        icono = {faTag}
                        placeholder = {"Seleccione el tipo de recordatorio"}
                        value = {tipoRecordatorio}
                        opcions = {opcionesTipoRecordatorio}
                        onChange = {handleTipoEvento}
                        type = "text"
                        name = ""
                        error={!!errorMessage}
                    />


                     <InputSelects
                        icono = {faHourglassStart}
                        placeholder = {"Seleccione el estado del recordatorio"}
                        value = {estadoRecordatorio}
                        onChange = {handleEstadoEvento}
                        type = "text"
                        name = ""
                        error={!!errorMessage}
                        opcions = {opcionesEstados}
                    />
                    
                    {/* solo se muestra si es seleccionado */}
                    {selectVisitadores && (
                        <InputSelects
                            icono = {faUser}
                            placeholder = {"Seleccione el visitador medico"}
                            value = {visitador}
                            onChange = {handleVisitador}
                            type = "text"        
                            name = ""
                            error={!!errorMessage}
                            opcions = {opcionesVisitadores}
                        />
                    )}
                        
                    <InputDates
                        icono = {faCalendar}
                        placeholder = {"Fecha del recordatorio"}
                        onChange = {handleDate}
                        selected = {fechaEvento}
                        minDate={new Date()}
                        error={!!errorMessage}
                    ></InputDates>

                    <IconoInput
                        icono = {faClock}
                        placeholder = {"Seleccione la hora"}
                        value = {horaEvento}
                        onChange = {handleHoraEvento}
                        type = "time"
                        error={!!errorMessage}
                        name = ""
                    
                    ></IconoInput>

                    <IconoInput
                        icono = {faClipboardList}
                        placeholder = {"Agregar descripción"}
                        value = {descripcion}
                        onChange = {handleDescripcion}
                        type = "text"
                        name = ""
                        error={!!errorMessage}
                    ></IconoInput>
  
                    
                    
                </div>

            </Popup>
        
            }
    </div>
  )
}
