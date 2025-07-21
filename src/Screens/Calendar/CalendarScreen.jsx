import { useRef, useState,useEffect,   } from 'react';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es';
import { useOutletContext } from 'react-router-dom';
import { faPen, faTag, faCalendar, faHourglassStart, faUser, faClipboardList} from '@fortawesome/free-solid-svg-icons';
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

export const CalendarScreen= () =>{

    //crear el calendario y manejar su adaptabilidad al tamaño
    const { rightPanelCollapsed } = useOutletContext();
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

    //opciones de Tipo de recordatorio
    const [tipoRecordatorio, setTipoRecordatorio] = useState([]);
    useEffect(() => {
            getOptions("http://localhost:3000/api/calendario/tipos-evento", item => ({
                value: item.id,
                label: item.nombre,
            })).then(setTipoRecordatorio);
    }, []);

    // //opciones de estado de recordatorio
    //  useEffect(() => {
    //         getOptions("http://localhost:3000/api/visitadores-medicos", item => ({
    //             value: item.id,
    //             label: item.nombre,
    //         })).then(setOpcionsRoles);
    
    //     }, []);

    //opciones de Visitadores medicos
    const [visitadores, setVisitadores] = useState([]);
    useEffect(() => {
            getOptions("http://localhost:3000/api/visitadores-medicos", item => ({
                value: item.id,
                label: item.nombre,
            })).then(setVisitadores);
    
        }, []);



    const [currentTitle, setCurrentTitle] = useState('');
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



  return (
    
    <div className='pantallaCalendario'>
        <div className='encabezado'>
            <div className='titleDiv'>
                <SimpleTitle text = "Calendario de actividades"/>
            </div>
            <ButtonHeaders text = 'Nuevo evento' onClick={openNuevoEvento}></ButtonHeaders>

            {/* Pop up para un nuevo evento*/}
            {<Popup 
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
                        value = {rol}
                        onChange = {true}
                        type = "text"
                        
                        name = ""

                       
                        error = {false}
                    
                        opcions = {tipoRecordatorio}
                    
                    />


                     <InputSelects
                        icono = {faHourglassStart}
                        placeholder = {"Seleccione el estado del recordatorio"}
                        value = {rol}
                        onChange = {true}
                        type = "text"
                        
                        name = ""

                       
                        error = {false}
                    
                        opcions = {[]}
                    
                    />

                    <InputSelects
                        icono = {faUser}
                        placeholder = {"Seleccione el visitador medico"}
                        value = {rol}
                        onChange = {true}
                        type = "text"
                        
                        name = ""

                       
                        error = {false}
                    
                        opcions = {visitadores}
                    
                    />
                        

                    <InputDates
                        icono = {faCalendar}
                        placeholder = {"Fecha del recordatorio"}
                    ></InputDates>

                    <IconoInput
                        icono = {faClipboardList}
                        placeholder = {"Seleccione la hora"}
                        value = {horaEvento}
                        onChange = {handleHoraEvento}
                        type = "time"
                        
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

        <div className='calendarioyEventos'>
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

                <div className='contentLeft'>
                    <div className='allTitle'>

                        <h3 className='tituloMes'>{currentTitle}</h3>
                        <div className='encabezadoStyle'>
                            <button className= 'buttonCalendar' onClick={handlePrev}>{'<'}</button>
                            <button className= 'buttonCalendar'onClick={handleToday}>Hoy</button>
                            <button className= 'buttonCalendar'onClick={handleNext}>{'>'}</button>
                        
                        </div>
                    </div>
                    
                    <div className='descripcionStyle'>
                        <h3 className='tituloMes'>Recordatorios de hoy</h3>
                    <div className='event-details'>
                        {selectedEvent
                            ? (
                                <div className = 'divEventos' key={selectedEvent.id}>
                                    
                                    <div className='tStyle'><strong>{selectedEvent.title}</strong></div>
                                    <b className='bStyle'>{selectedEvent.startStr}</b>
                                    <p className='desc'>{selectedEvent.extendedProps.descripcion}</p>
                                    <button className='buttonCalendar' onClick={() => onEditEvent(selectedEvent.id)}>Editar</button>
                                </div>
                                )
                            : (
                                events.map((ev) => (
                                    <div className = 'divEventos'
                                    key={ev.id}>
                                        
                                        <div className='tStyle'><strong>{ev.title}</strong></div>
                                        <b className='bStyle'>{ev.date}</b>
                                        <p className='desc'>{ev.descripcion}</p>
                                        <button className= 'buttonCalendar' onClick={() => onEditEvent(ev.id)}>Editar</button>
                                    </div>
                                ))
                                )
                            }

                    </div>
                </div>
                
                

            </div>

        </div>
    </div>
  )
}
