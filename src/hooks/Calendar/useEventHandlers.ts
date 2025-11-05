/* useEventHandlers
Hook personalizado que agrupa funciones relacionadas con la creación, edición y eliminación de eventos en el calendario.

Funciones incluidas:
  - combinarFechaYHora(fecha, hora): une una fecha y una hora en formato ISO.
  - obtenerHoraDesdeFecha(fechaISO): extrae la hora (hh:mm) desde una fecha ISO.
  - crearEvento(datosEvento): crea un nuevo evento enviando datos al backend.
  - actualizarEvento(idEvento, datosActualizados): actualiza un evento existente.
  - HandleEliminarEvento(idEvento): marca un evento como eliminado (soft delete).

Este hook facilita la separación de lógica de negocio desde el componente visual `CalendarScreen`.

Parámetros (UseEventHandlersProps):
  - token: string → token JWT para autenticación.
  - localId: number → ID del local asociado al evento.
  - onSuccess: función callback para mostrar mensajes positivos.
  - onError: función callback para mostrar errores.
  - removeEventFromState (opcional): función para eliminar el evento del estado si se desea reflejar inmediatamente la eliminación.

Autor: Melisa
Última modificación: 17/08/2025
*/

import { useCheckToken } from "../../utils/checkToken";

declare global {
  interface ImportMeta {
    readonly env: {
      VITE_API_URL: string;
    };
  }
}

const apiUrl = import.meta.env.VITE_API_URL;


interface EventoDatos {
  titulo: string;
  tipo_evento_id: number;
  estado_id?: number;
  fecha: string;
  visitador_id: number | null;
  detalles: string;
  local_id?: number;
}

interface UseEventHandlersProps {
  token: string;
  localId: number;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  removeEventFromState?: (id: number) => void;
}

export function useEventHandlers({
  token,
  localId,
  onSuccess,
  onError,
  removeEventFromState
}: UseEventHandlersProps) {
  const checkToken = useCheckToken();

/**
 * Combina una fecha (Date) y una hora (string "hh:mm")
 * y retorna una fecha en formato ISO (string).
 * Devuelve null si alguno de los valores es inválido.
 */
  const combinarFechaYHora = (fecha: Date | null, hora: string): string | null => {
      if (!fecha || !hora) return null;

      const [horaStr, minutoStr] = hora.split(':');
      const fechaFinal = new Date(fecha);
      fechaFinal.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);
      return fechaFinal.toISOString();
  };

 /**
   * Recibe una fecha en formato ISO y extrae la hora
   * en formato "hh:mm", útil para prellenar formularios.
   */
  const obtenerHoraDesdeFecha = (fechaISO: string): string => {
      const fecha = new Date(fechaISO);
      const horas = fecha.getHours().toString().padStart(2, '0');
      const minutos = fecha.getMinutes().toString().padStart(2, '0');
      return `${horas}:${minutos}`;
  };

/**
   * Envía una solicitud POST para crear un nuevo evento.
   * Llama a onSuccess si todo va bien, o a onError si falla.
   */
  const crearEvento = async (datosEvento: EventoDatos) => {
  

    try {
      const response = await fetch(`${apiUrl}/api/calendario`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosEvento)
      });
      if (!checkToken(response)) return;

      if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(`Error ${response.status}: ${mensaje}`);
      }

      const data = await response.json();
      onSuccess('Evento creado con éxito');
      return data;
    } catch (error: any) {
      console.error('Error creando evento:', error);
      onError('Ocurrió un error al crear el evento.');
      throw error;
    }
  };


  /**
   * Envía una solicitud PUT para actualizar los datos de un evento existente.
   * Recibe el ID del evento y los datos actualizados.
   */
  const actualizarEvento = async (idEvento: number, datosActualizados: EventoDatos) => {
    try {
      const response = await fetch(`${apiUrl}/api/calendario/${idEvento}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
      });
      if (!checkToken(response)) return;

      if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(`Error ${response.status}: ${mensaje}`);
      }

      const data = await response.json();
      onSuccess('Evento actualizado con éxito');
      return data;
    } catch (error: any) {
      console.error('Error actualizando evento:', error);
      onError('Ocurrió un error al actualizar el evento.');
      throw error;
    }
  };


  /**
   * Envía una solicitud PUT para marcar un evento como eliminado.
   * Esto es un "soft delete", no lo borra de la base de datos.
   * Si se proporciona `removeEventFromState`, elimina visualmente el evento del estado.
   */
  const HandleEliminarEvento = async (idEvento: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/calendario/${idEvento}/marcar-eliminado`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!checkToken(response)) return;

      if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(`Error ${response.status}: ${mensaje}`);
      }

      if (removeEventFromState) {
        removeEventFromState(idEvento);
      }

      onSuccess('Evento eliminado con éxito');
    } catch (error: any) {
      console.error('Error eliminando evento:', error);
      onError(`No se pudo eliminar el evento. ${error.message}`);
    }
  };

  // Exporta las funciones que serán utilizadas por CalendarScreen
  return {
    combinarFechaYHora,
    obtenerHoraDesdeFecha,
    crearEvento,
    actualizarEvento,
    HandleEliminarEvento,
  };
}
