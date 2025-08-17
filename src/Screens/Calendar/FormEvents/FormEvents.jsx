import { faPen, faTag, faCalendar, faCalendarDay, faHourglassStart, faUser, faArrowLeft,faClipboardList, faAngleLeft, faAngleRight, faClock, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconoInput from "../../../components/Inputs/InputIcono"
import InputSelects from "../../../components/Inputs/InputSelects"
import InputDates from '../../../components/Inputs/InputDates';



export const FormEvents = ({
    edit = false,
    nombreEvento,
    handleNombreEvento,
    tipoRecordatorio,
    opcionesTipoRecordatorio,
    handleTipoEvento,
    selectVisitadores,
    visitador,
    handleVisitador,
    opcionesVisitadores,
    handleDate,
    fechaEvento,
    horaEvento,
    handleHoraEvento,
    descripcion,
    handleDescripcion,

    estadoRecordatorio,
    opcionesEstados,
    handleEstadoEvento,

    errorMessage,


}) => {
    return (
        <>
            

            <IconoInput
                icono = {faPen}
                placeholder = {"Nombre del recordatorio"}
                value = {nombreEvento}
                onChange = {handleNombreEvento}
                type = "text"
                error={!!errorMessage}
                name = ""
                    
            />

            {edit ? (
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
            ) : (
                <></>
            )

            }

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


            

            
        
        
        </>
    )

}