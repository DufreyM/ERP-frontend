import { useRef, useState,useEffect  } from 'react';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import esLocale from '@fullcalendar/core/locales/es';
import { faPen, faEnvelope, faCalendar, faGear, faHouse, faLockOpen} from '@fortawesome/free-solid-svg-icons';
import SimpleTitle from '../../components/Titles/SimpleTitle'
import "./CalendarScreen.css"
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import Popup from '../../components/PopupButton/PopupBotton';
import InputDates from '../../components/Inputs/InputDates';
import IconoInput from '../../components/Inputs/InputIcono';
import InputSelects from '../../components/Inputs/InputSelects';

export const CalendarScreen= () =>{
    const calendarRef = useRef(null);
    const [currentTitle, setCurrentTitle] = useState('');
    const [rol, setRol] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);


    const handlePrev = () => calendarRef.current.getApi().prev();
    const handleNext = () => calendarRef.current.getApi().next();
    const handleToday = () => calendarRef.current.getApi().today();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

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

    
    <div>
        {<Popup isOpen={isPopupOpen} onClose={closePopup}>
            <SimpleTitle text= 'Nuevo evento'></SimpleTitle>
            

            {/* Casilla de nacimiento*/}
            <InputDates
                icono = {faCalendar}
                placeholder="Fecha de Nacimiento"
                selected
                onChange
                //error
                maxWidth = '300px'
            ></InputDates>

            <InputSelects
                icono={faGear}
                placeholder="Tipo de rol"
                value={rol}
                //error
                
                onChange={handleRolChange}
                name="email"
                opcions={opcionsRoles}
                >
        
            </InputSelects>

            <IconoInput
                icono={faPen}
                placeholder="Descripción"
                
                //error
                onChange
                >
                    
       
            </IconoInput>



            <div className='encabezadoStyle'>
                <ButtonForm text= 'Guardar'></ButtonForm>
                <ButtonForm text= 'Cancelar' onClick={closePopup}></ButtonForm>
                
            </div>

            

          
            


         </Popup>}
        <SimpleTitle text = "Calendario de actividades"/>

        <div className='divisionCalendario'>
            <div className='contenedorCalendario'>
            <FullCalendar
                headerToolbar={false}
                ref={calendarRef}
                datesSet={(arg) => setCurrentTitle(arg.view.title)}
                locales = {[esLocale]}
                locale = "es"
                
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                weekends={true}
                eventClick={(info) => {
                    setSelectedEvent(info.event);
                }}
                events = {events}
                
                
            
            />
            </div>
         
            <div className='descripcionStyle'>
                 
                <SimpleTitle text = {currentTitle}/>
                <div className='encabezadoStyle'>
                
                    <button className= 'buttonCalendar' onClick={handlePrev}>{'<'}</button>
                    <button className= 'buttonCalendar'onClick={handleToday}>Hoy</button>
                    <button className= 'buttonCalendar'onClick={handleNext}>{'>'}</button>
                
                </div>

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


                <ButtonForm text = 'Nuevo evento' onClick={openPopup}></ButtonForm>
                
                

            </div>

        </div>
    </div>
  )
}
