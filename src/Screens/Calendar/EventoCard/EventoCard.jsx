import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './EventoCard.css';

const EventoCard = ({
    id,
    title,
    descripcion,
    date,
    estado,
    tipo,
    visitador,
    onEdit,
    onDelete,
    expandirInicial = false
}) => {
    const [expandir, setExpandir] = useState(expandirInicial);

    return (
        <div className='divEventos' key={id}>
            <div className= 'espaciadoExtremos'>
                <div className='vineta'></div>

                <div className='contenido'>
                    <div className='tituloEvento'>{title}</div>
                    {date && <p className='bStyle'>{new Date(date).toLocaleString()}</p>}

                    {expandir && (

                    <div className='detallesExpandibles'>

                    {descripcion && <p className='desc'>{descripcion}</p>}

                    {estado && <p>Estado: {estado}</p>}
                    {tipo && <p>Tipo: {tipo}</p>}

                    {visitador && (
                        <p>Visitador: {visitador}</p>
                    )}
                    <div className='opcionesBotones'>
                        <button className='buttonText2' onClick={onDelete}>
                            <strong>Eliminar</strong>
                        </button>

                        <button className='buttonText' onClick={onEdit}>
                            <strong>Editar</strong>
                        </button>

                    </div>
                </div>
            
                )}
                </div>
            </div>

            

            <button
                className='buttonCalendarRow'
                onClick={() => setExpandir(!expandir)}
                style={{ marginBottom: '4px' }}
                >
                <FontAwesomeIcon icon={expandir ? faChevronUp : faChevronDown} />
            </button>
        
         </div>
        
  );
};

export default EventoCard;
