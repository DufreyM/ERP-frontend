/*Calendar Screen
Es el botón que tiene una pregunta y generalmente redirecciona -> ¿eres visitador médico? ingresa
El estilo se encuentra en el archivo CalendarScreen.css (no utiliza module ya que la librería del calendario no la acepta)
Depende de muchos archivos
Atributos:
  ninguno
Autor: Melisa 
Ultima modificación: 17/8/2025 
*/

import { useRef, useState,useEffect,   } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es';
import { useOutletContext } from 'react-router-dom';
import {faCalendarDay,  faArrowLeft, faAngleLeft, faAngleRight, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import SimpleTitle from '../../components/Titles/SimpleTitle'
import "./CalendarScreen.css"
import { useFetch } from "../../utils/useFetch";
import Popup from '../../components/Popup/Popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getToken } from '../../services/authService';
import EventoCard from './EventoCard/EventoCard';
import { useOpcionsCalendarForm } from '../../hooks/Calendar/useOpcionsCalendarForm';
import { useEventHandlers } from '../../hooks/Calendar/useEventHandlers';
import { FormEvents } from './FormEvents/FormEvents';

export const CalendarScreen= () =>{
    //crear el calendario y manejar su adaptabilidad al tamaño ya que no se renderiza con la barra de notificaciones.
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

    //Variables para forzar el renderizado de la pagina en caso sea necesario
    const [key, setKey] = useState(0);  
    const actualizar = () => setKey(prev => prev + 1);

    //Obtener datos de la base de datos
    const token = getToken();                       //Se solicita el tocken del inicio de sesión ya que es solicitado en el fetch
    const { selectedLocal } = useOutletContext();   //Se llama al contexto (En qué local se está)
    const localSeleccionado = selectedLocal + 1 ;   //Se suma 1 ya que el indice empieza en 0, pero en la base de datos comienza con 1
    const url = `${import.meta.env.VITE_API_URL}/api/calendario?local_id=${localSeleccionado}`;   //url para los eventos dependiendo del local

    //Se llama a traer la función useFetch (utils/useFetch) que retorna la carga de datos, y existe la opción de forzar un refetch manual en caso de modificaciones a los eventos.
    const { data, loading, error, refetch } = useFetch(url, {
        headers: {'Authorization': `Bearer ${token}`}
    });

    const eventos = Array.isArray(data) ? data : [];    //Se guardan los datos en un array

    useEffect(() => {         //Se llenan con los datos necesarios
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

    //estado que maneja y muestra errores
    const [errorMessage, setErrorMessage] = useState('');

    //Se manda a llamar las siguientes funciones para extraer las opciones disponibles para mostrar en los 3 selects del formulario
    //Se llaman de useOpcionsCalendarForm (hooks/calendar/useOpcionsCalendarForm) se manda el local, ya que visitadores manda respuestas distintas dependiendo el local
    const { opcionesTipoRecordatorio, opcionesEstados, opcionesVisitadores } = useOpcionsCalendarForm(localSeleccionado, token);

    //Variables de datos y formularios
    const [nombreEvento, setNombreEvento] = useState('');
    const [fechaEvento, setFechaEvento] = useState(null);
    const [horaEvento, setHoraEvento] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipoRecordatorio, setTipoRecordatorio] = useState('');
    const [estadoRecordatorio, setEstadoRecordatorio] = useState('');
    const [visitador, setVisitador] = useState('');

    //handles para manejar la información de cada Input
    const handleNombreEvento = (e) => {
        setNombreEvento(e.target.value);
        setErrorMessage('');
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

    const handleHoraEvento = (e) => { //en base de datos se espera un datetime, por lo que se separa en inputs de date y time
        const value = e.target.value;
        setHoraEvento(e.target.value);
         if (/^\d{0,2}(:\d{0,2})?$/.test(value)) {
            setHoraEvento(value);
            setErrorMessage('');
        }
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

    //activar el select de visitadores medicos si se selecciona esa opcion (en tipo de evento)
    const [selectVisitadores, setSelectVisitadores] = useState(false);
    useEffect(() => {
        const newState = tipoRecordatorio === "1";
        if (selectVisitadores !== newState) {
            setSelectVisitadores(newState); 
        }
    }, [tipoRecordatorio]);

    //Maneja las noticiaciones de creación eliminación o edición de un estado
    const [notificacion, setNotificacion] = useState('');
    useEffect(() => {
        if (notificacion) {
            const timer = setTimeout(() => {
            setNotificacion('');
            }, 2500); // se quita en 2.5 segundos

            return () => clearTimeout(timer);
        }
    }, [notificacion]);

    //Nuevo evento (incluye el manejo del popUp)
    const [nuevoEvento, setNuevoEvento] = useState(false);
    const openNuevoEvento = () => {limpiarFormulario(); setNuevoEvento(true)};
    const closeNuevoEvento = () => {setNuevoEvento(false); setErrorMessage('');};

    //Editar un evento (incluye el manejo del popUp)
    const [eventoAEditar, setEventoAEditar] = useState(null);
    const [editarEvento, setEditarEvento] = useState(false);
    const openEditarEvento = () => setEditarEvento(true);
    const closeEditarEvento = () => {setEditarEvento(false); setErrorMessage('');};

    //eliminar un evento (incluye el manejo del popUp)
    const [eliminarEvento, setEliminarEvento] = useState(false);
    const [eventoAEliminar, setEventoAEliminar] = useState(null);
    const openEliminarEvento = () => setEliminarEvento(true);
    const closeEliminarEvento = () => {setErrorMessage(''); setEliminarEvento(false);};

    //Obtener estas funciones desde useEventsHandlers (hooks/calendar/useEvents)
    const { combinarFechaYHora, obtenerHoraDesdeFecha, crearEvento, actualizarEvento, HandleEliminarEvento } = useEventHandlers({
        token,
        localId: localSeleccionado,
        onSuccess: (msg) => setNotificacion(msg),
        onError: (msg) => setErrorMessage(msg),
        removeEventFromState: (id) => setEvents(prev => prev.filter(e => e.id !== id))
    });

    //Handle para crear eventos, utiliza varias funciones de otros archivos
    const handleCrearEvento = async () => {
        setErrorMessage('');    //settea errores en caso no haber incluido datos necesarios
        if (!nombreEvento.trim() || !fechaEvento || !horaEvento  || !tipoRecordatorio) {
            setErrorMessage('Por favor, completa todos los campos obligatorios.');
            return;
        }

        if (selectVisitadores && !visitador) { //como solo se usa en ciertas ocaciones, se maneja aparte
            setErrorMessage('Debes seleccionar un visitador médico.');
            return;
        }

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
        //console.log('estoy mandando:', datosEvento); //asegurarme

        try {
            const respuesta = await crearEvento(datosEvento);
            closeNuevoEvento();                             //cierra el popUp
            setNotificacion('Evento creado con éxito');     //llama a la notificación
            console.log('Evento creado:', respuesta);       //asegurarme
            await refetch();                                //hace un refetch para volver a llamar los datos que se actualizaron
            actualizar()                                    //vuelve a renderizar por si acaso
           
        } catch (error) {
            console.error('Error al crear evento:', error);
            setErrorMessage('Ocurrió un error al crear el evento. Intenta nuevamente.');
        }
    };

    //Esta función se utiliza al intentar editar un evento, ya que llena el popup con los datos almacenados y poder modificarlos a partir de eso (ux) (NO tocar)
    const cargarDatosEventoEnFormulario = (evento) => {
        const tipoId = evento.tipo_evento_id?.toString();
        setNombreEvento(evento.titulo);
        setTipoRecordatorio(tipoId);
        setEstadoRecordatorio(evento.estado_id?.toString());
        setVisitador(evento.visitador?.id?.toString() || '');
        setFechaEvento(new Date(evento.fecha));
        setHoraEvento(obtenerHoraDesdeFecha(evento.fecha));
        setDescripcion(evento.detalles);

        // pa que actualice el select en caso el evento necesite al visitador
        setTimeout(() => {
            if (tipoId === '1') {
                setSelectVisitadores(true);
            } else {
                setSelectVisitadores(false);
            }
        }, 0); 
    };

    //limpia lo anterior
    const limpiarFormulario = () => {
        setNombreEvento('');
        setDescripcion('');
        setFechaEvento(null);
        setHoraEvento('');
        setTipoRecordatorio('');
        setEstadoRecordatorio('');
        setVisitador('');
        setSelectVisitadores(false);
        setErrorMessage('');
    };

    //Handle para editar el evento, depende de funciones de otros archivos 
    const handleEditarEvento = async () => {
        if (!eventoAEditar) return;
        const fechaISO = combinarFechaYHora(fechaEvento, horaEvento);

        const datos = {
            titulo: nombreEvento,
            tipo_evento_id: parseInt(tipoRecordatorio, 10),
            estado_id: parseInt(estadoRecordatorio, 10),
            visitador_id: selectVisitadores ? parseInt(visitador) : null,
            fecha: fechaISO,
            detalles: descripcion
        }; 

        try { //la misma cosa que en crear datos
            const respuesta = await actualizarEvento(eventoAEditar, datos);
            console.log("Evento actualizado:", respuesta);
            setNotificacion("Evento actualizado con éxito");
            closeEditarEvento();
            await refetch();
            setSelectedEvent(null);     //esta funciona cuando se intenta editar desde un evento especifico para que deje de mostrar datos anteriores
        } catch (error) {
            console.error("Error al actualizar evento:", error);
            setErrorMessage("No se pudo actualizar el evento.");
        }
    };

    //Compacta todo lo que se hace al eliminar
    const handleEliminarYCerrar = async () => {
        await HandleEliminarEvento(eventoAEliminar); 
        closeEliminarEvento();   
        await refetch();       
        actualizar();    
        setSelectedEvent(null);        //esta funciona cuando se intenta editar desde un evento especifico para que deje de mostrar datos anteriores
    };

    //Es la función que se encarga de abrir el popUp y mandar el id del elemento que se quiere eleminar
    const onDeleteEvent = (id) => {
        const parsedId = parseInt(id, 10);
        if (!parsedId || isNaN(parsedId)) {
            console.error("No se proporcionó un ID de evento válido:", id);
            return;
        }

        setEventoAEliminar(parsedId); // ✅ ID numérico
        openEliminarEvento();
    };

    //obtiene el día de hoy xd
    const obtenerDiaHoy = () => {
        const hoy = new Date(); // Obtén la fecha de hoy
        const opciones = { weekday: 'long', day: 'numeric' }; // Formato: Día de la semana, Día del mes
        const fechaFormateada = hoy.toLocaleDateString('es-ES', opciones); // 'es-ES' para español
        return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1); // Capitalizar la primera letra
    }

    //Renrediza los eventos pequeñitos en calendario no en la barra vertical izquierda
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

    //Si hay un evnto especifico seleecionado o no
    const [selectedEvent, setSelectedEvent] = useState(null); 
    const [events, setEvents] = useState([]);
    
    //Hadles para el funcionamiento de botones de la librería de calendario
    const handlePrev = () => calendarRef.current.getApi().prev();
    const handleNext = () => calendarRef.current.getApi().next();
    const handleToday = () => calendarRef.current.getApi().today();

    //detalles esteticos, ayuda a determinar el dia de hoy, para mostrar lo eventos de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const eventosDeHoy = eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        fechaEvento.setHours(0, 0, 0, 0);
        return fechaEvento.getTime() === hoy.getTime();
    });

    //lo mismo que lo anterior pero determina una semana
    const finSemana = new Date(hoy);
    finSemana.setDate(hoy.getDate() + 6);

    const eventosDeLaSemana = eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        fechaEvento.setHours(0, 0, 0, 0);
        return fechaEvento > hoy && fechaEvento <= finSemana;
    });


//Por fin, el return
return (
    
    <div className='pantallaCalendario' key = {key}>
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

            {/* El Calendario como tal con los eventos */}
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
                    eventClick={(info) => { setSelectedEvent(info.event);}}
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
                {/* 
                    La barra lateral, muestra si se están cargando los eventos, si no se pudo acceder a la base de datos
                    Muestra el evento seleccionado al hacerle click a uno de los eventos en el calendario general
                    Inicialmente muestra los eventos de hoy y de un rango en 6 días, si no hay, lo especifica
                */}

                <div className='event-details'>
                    {
                        loading ? ( <div>Cargando eventos...</div>) 
                        : error ? ( <div>Error al cargar los eventos: {error.message}</div> ) 
                        : selectedEvent ? (
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
                                        tipo={opcionesTipoRecordatorio.find(
                                                tipo => tipo.value === selectedEvent.extendedProps.raw?.tipo_evento_id
                                            )?.label || null
                                        }
                                        visitador={opcionesVisitadores.find(
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
                                        }
                                    )
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
        {
            <Popup 
            isOpen={eliminarEvento} title={'Eliminar un recordatorio'}
            onClose={closeEliminarEvento} onClick={handleEliminarYCerrar}
            >
                <div className='modalContenido'>
                    {errorMessage && (
                        <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
                    )}
                </div>

            </Popup>
        }


        {/* Pop up para un nuevo evento, utilica un componete que compacta el formulario*/}
        {
            <Popup 
                key={selectVisitadores} isOpen={nuevoEvento}  title={'Crear un nuevo recordatorio'} 
                onClose={closeNuevoEvento} onClick={handleCrearEvento}
            >
                <div className='modalContenido'>
                    <FormEvents
                        nombreEvento = {nombreEvento}
                        handleNombreEvento = {handleNombreEvento}
                        tipoRecordatorio = {tipoRecordatorio}
                        opcionesTipoRecordatorio = {opcionesTipoRecordatorio}
                        handleTipoEvento = {handleTipoEvento}
                        selectVisitadores = {selectVisitadores}
                        visitador = {visitador}
                        handleVisitador = {handleVisitador}
                        opcionesVisitadores = {opcionesVisitadores}
                        handleDate = {handleDate}
                        fechaEvento = {fechaEvento}
                        horaEvento = {horaEvento}
                        handleHoraEvento = {handleHoraEvento}
                        descripcion = {descripcion}
                        handleDescripcion = {handleDescripcion}
                        errorMessage = {errorMessage}                
                    />
                </div>
            </Popup>
        }
   
        {/* Pop up para editar un evento, utilica un componete que compacta el formulario*/}
        {
            <Popup 
                isOpen={editarEvento} title={'Editar un recordatorio'}
                onClose={closeEditarEvento} onClick={handleEditarEvento}
            >
                <div className='modalContenido'>
                    <FormEvents
                        edit = {true}
                        nombreEvento = {nombreEvento}
                        handleNombreEvento = {handleNombreEvento}
                        tipoRecordatorio = {tipoRecordatorio}
                        opcionesTipoRecordatorio = {opcionesTipoRecordatorio}
                        handleTipoEvento = {handleTipoEvento}
                        selectVisitadores = {selectVisitadores}
                        visitador = {visitador}
                        handleVisitador = {handleVisitador}
                        opcionesVisitadores = {opcionesVisitadores}
                        handleDate = {handleDate}
                        fechaEvento = {fechaEvento}
                        horaEvento = {horaEvento}
                        handleHoraEvento = {handleHoraEvento}
                        descripcion = {descripcion}
                        handleDescripcion = {handleDescripcion}
                        estadoRecordatorio = {estadoRecordatorio}
                        opcionesEstados = {opcionesEstados}
                        handleEstadoEvento = {handleEstadoEvento}
                        errorMessage = {errorMessage}
                    />                    
                </div>
            </Popup>
        }
    </div>
  )
}