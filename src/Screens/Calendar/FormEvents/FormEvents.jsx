/* FormEvents
Formulario reutilizable para crear o editar eventos del calendario.  (SOLO PARA CALENDARIO)
Incluye campos para título, tipo de recordatorio, fecha, hora, visitador médico, estado y descripción.

Este componente utiliza inputs personalizados:
  - IconoInput: input de texto con ícono.
  - InputSelects: select personalizado con ícono.
  - InputDates: selector de fecha con ícono.

Props:
  - edit: boolean → si es true, muestra el campo para editar el estado del evento.
  - nombreEvento: string → valor del input para el nombre del evento.
  - handleNombreEvento: function → manejador de cambio para el nombre.
  - tipoRecordatorio: string/number → valor seleccionado para el tipo.
  - opcionesTipoRecordatorio: array → opciones para el select de tipo.
  - handleTipoEvento: function → manejador de cambio para el tipo.
  - selectVisitadores: boolean → si es true, muestra el campo de selección de visitador.
  - visitador: string/number → valor seleccionado del visitador.
  - handleVisitador: function → manejador de cambio del visitador.
  - opcionesVisitadores: array → opciones para el select de visitadores.
  - handleDate: function → manejador para la fecha seleccionada.
  - fechaEvento: Date → fecha seleccionada.
  - horaEvento: string → hora seleccionada en formato hh:mm.
  - handleHoraEvento: function → manejador del cambio de hora.
  - descripcion: string → valor del input de descripción.
  - handleDescripcion: function → manejador de cambio de descripción.
  - estadoRecordatorio: string/number → valor del estado (solo en edición).
  - opcionesEstados: array → opciones para el estado del recordatorio.
  - handleEstadoEvento: function → manejador del cambio de estado.
  - errorMessage: string → mensaje de error para mostrar validaciones.

Autor: Melisa
Última modificación: 17/08/2025
*/

import { faPen, faTag, faCalendar, faHourglassStart, faUser,faClipboardList,  faClock} from '@fortawesome/free-solid-svg-icons';
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