import { useRef, useState,useEffect,   } from 'react';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es';
import { useOutletContext } from 'react-router-dom';
import { faPen, faTag, faCalendar, faCalendarDay, faHourglassStart, faUser, faClipboardList, faAngleLeft, faAngleRight, faClock, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import SimpleTitle from '../../components/Titles/SimpleTitle'
import "./CalendarScreen.css"
import { useFetch } from "../../utils/useFetch";
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import Popup from '../../components/Popup/Popup';
import InputDates from '../../components/Inputs/InputDates';
import IconoInput from '../../components/Inputs/InputIcono';
import InputSelects from '../../components/Inputs/InputSelects';
import ButtonHeaders from '../../components/ButtonHeaders/ButtonHeaders';
import { getToken } from '../../services/authService';
import { getOptions } from '../../utils/selects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

    console.log("datos calendario:")
    console.log(data)
    console.log("fin datos calendario:")

    //opciones de Tipo de recordatorio
    const [errorMessage, setErrorMessage] = useState('');
    const [tipoRecordatorio, setTipoRecordatorio] = useState('');
    const [opcionesTipoRecordatorio, setOpcionesTipoRecordatorio] = useState([]);
    useEffect(() => {
            getOptions("http://localhost:3000/api/calendario/tipos-evento", item => ({
                value: item.id,
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
        console.log("FECHA ACTUAL SELECCIONADA:", fechaEvento, typeof fechaEvento);
        setErrorMessage(""); // Limpia el mensaje si todo está bien
        setFechaEvento(date);
    
    };

    //activar el select de visitadores medicos si se selecciona esa opcion
    // Definir el estado
const [selectVisitadores, setSelectVisitadores] = useState(false);

// Primer useEffect - monitorea tipoRecordatorio
useEffect(() => {
    console.log(`tipoRecordatorio: ${tipoRecordatorio}`);

    // Solo actualiza si el valor cambia realmente
    const newState = tipoRecordatorio === 1;
    if (selectVisitadores !== newState) {
        setSelectVisitadores(newState); // Actualiza el estado solo si es necesario
        console.log(`Nuevo estado selectVisitadores: ${newState}`);
    }
}, [tipoRecordatorio]);

// Segundo useEffect - monitorea selectVisitadores
useEffect(() => {
    console.log(`cambio: ${selectVisitadores}`);
}, [selectVisitadores]);


    
    

    
    const [rol, setRol] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);


    const handlePrev = () => calendarRef.current.getApi().prev();
    const handleNext = () => calendarRef.current.getApi().next();
    const handleToday = () => calendarRef.current.getApi().today();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);


    //popUp Nuevo evento
    const [nuevoEvento, setNuevoEvento] = useState(false);
    const openNuevoEvento = () => setNuevoEvento(true);
    const closeNuevoEvento = () => setNuevoEvento(false);


    const handleRolChange = (e) => {
        setRol(e.target.value);
        setErrorMessage('');
    };
    const onEditEvent = (id) => {
    console.log("Editar evento con id:", id);
    openPopup(); // si quieres usar tu popup
    };


    const opcionsRoles = [
    { value: 'admin', label: 'Visita' },
    { value: 'editor', label: 'Completar Pago' },
    { value: 'lector', label: 'Comprar Medicamento' },
    ];

    const [events, setEvents] = useState([
        { id: 1, title: 'Compra de yeso', date: '2025-05-01', descripcion: 'Se necesitan 10 unidades de yeso, ya que Erick las consumió todas' },
        { id: 2, title: 'Completar pago', date: '2025-05-04', descripcion: 'El visitador de LaboratorioFam pasará por una suma de Q250.00' }
    ]);

    const handleAddEvent = () => {
        const newEvent = {
            id: Date.now(),
            title: 'Nuevo evento',
            date: new Date().toISOString().split('T')[0],
            descripcion: 'Nuevo evento creado'
        };
        setEvents([...events, newEvent]);
    };







    if (loading) {
        return <div>Cargando eventos...</div>;
    }

    if (error) {
        return <div>Error al cargar los eventos: {error.message}</div>;
    }

    if (!data || data.length === 0) {
        return <div>No hay eventos disponibles.</div>;
    }



  return (
    
    <div className='pantallaCalendario'>
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
                
                />  
            </div>

            
        </div>



        
            

        <div className='contentLeft'>

            <h3 className='tituloMes'>Recordatorios</h3>
            <div className='divbuttons'>

                <h2 className='title2'>Mes</h2>
                <button className= 'buttonCalendarRow' onClick={openNuevoEvento}>
                    <FontAwesomeIcon icon = {faPlusCircle} style={{fontSize: '25px'}}/>
                </button>
            </div>
            

            
            <div className='descripcionStyle'>
                
            <div className='event-details'>
                {selectedEvent
                    ? (
                        <div className = 'divEventos' key={selectedEvent.id}>
                            <div className='viñeta'/>
                            <p>deuwfuiehwfuihewui</p>


                            <div className='contenido'>
                                <div className='tStyle'><strong>{selectedEvent.title}</strong></div>
                                <b className='bStyle'>{selectedEvent.startStr}</b>
                                <p className='desc'>{selectedEvent.extendedProps.descripcion}</p>
                                <button className='buttonCalendar' onClick={() => onEditEvent(selectedEvent.id)}>Editar</button>
                                
                            </div>
                        </div>
                        )
                    : (
                        events.map((ev) => (
                            <div className = 'divEventos'
                            key={ev.id}>
                                <div className='vineta'></div>
                                
                                
                                <div className='contenido'>
                                    <div className='tStyle'>{ev.title}</div>
                                    <p className='desc'>{ev.descripcion}</p>
                                    <p className='bStyle'>{ev.date}</p>
                                </div> 
                               
                                <button className= 'buttonCalendarRow' onClick={() => onEditEvent(ev.id)}>
                                    <FontAwesomeIcon icon = {faPen} style={{fontSize: '20px'}}/>
                                </button>
                            </div>
                        ))
                        )
                }



                <h2>Eventos del Calendario</h2>
            <ul>
                {data.map((evento) => (
                    <li key={evento.id} >
                        <h3>{evento.titulo}</h3>
                        <p><strong>Estado:</strong> {evento.estado.nombre}</p>
                        <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleString()}</p>
                        <p><strong>Tipo de Evento:</strong> {evento.tipo_evento}</p>
                        <p><strong>Local:</strong> {evento.local.nombre} - {evento.local.direccion}</p>
                        <p><strong>Usuario:</strong> {evento.usuario.nombre} {evento.usuario.apellidos}</p>
                        {evento.visitador && (
                            <p><strong>Visitador:</strong> {evento.visitador.proveedor_id}</p>
                        )}
                    </li>
                ))}
            </ul> 

            </div>
        </div>            
    </div>
      






        {/* Pop up para un nuevo evento*/}
            {<Popup 
            key={selectVisitadores}
                isOpen={nuevoEvento} 
                onClose={closeNuevoEvento}
                title={'Crear un nuevo recordatorio'}
            
            >
                <div className='modalContenido'>

                    <IconoInput
                        icono = {faPen}
                        placeholder = {"Nombre del recordatorio"}
                        value = {nombreEvento}
                        onChange = {handleNombreEvento}
                        type = "text"
                        
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
                        error = {false}
                    />


                     <InputSelects
                        icono = {faHourglassStart}
                        placeholder = {"Seleccione el estado del recordatorio"}
                        value = {estadoRecordatorio}
                        onChange = {handleEstadoEvento}
                        type = "text"
                        name = ""
                        error = {false}
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
                            error = {false}
                            opcions = {opcionesVisitadores}
                        />
                    )}
                        
                    <InputDates
                        icono = {faCalendar}
                        placeholder = {"Fecha del recordatorio"}
                        onChange = {handleDate}
                        selected = {fechaEvento}
                        minDate={new Date()}
                    ></InputDates>

                    <IconoInput
                        icono = {faClock}
                        placeholder = {"Seleccione la hora"}
                        value = {horaEvento}
                        onChange = {handleHoraEvento}
                        type = "time"
                        error={false}
                        name = ""
                    
                    ></IconoInput>

                    <IconoInput
                        icono = {faClipboardList}
                        placeholder = {"Agregar descripción"}
                        value = {descripcion}
                        onChange = {handleDescripcion}
                        type = "text"
                        name = ""
                    ></IconoInput>
  
                    
                    
                </div>

            </Popup>
        
            }
    </div>
  )
}
