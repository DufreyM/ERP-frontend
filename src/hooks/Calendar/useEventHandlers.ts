// hooks/useEventHandlers.ts

import { useState, useEffect } from 'react';

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

  // Combina fecha y hora en formato ISO
const combinarFechaYHora = (fecha: Date | null, hora: string): string | null => {
    if (!fecha || !hora) return null;

    const [horaStr, minutoStr] = hora.split(':');
    const fechaFinal = new Date(fecha);
    fechaFinal.setHours(parseInt(horaStr), parseInt(minutoStr), 0, 0);
    return fechaFinal.toISOString();
};

const obtenerHoraDesdeFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
};

const crearEvento = async (datosEvento: EventoDatos) => {
    try {
      const response = await fetch('http://localhost:3000/api/calendario', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosEvento)
      });

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

  const actualizarEvento = async (idEvento: number, datosActualizados: EventoDatos) => {
    try {
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

      const data = await response.json();
      onSuccess('Evento actualizado con éxito');
      return data;
    } catch (error: any) {
      console.error('Error actualizando evento:', error);
      onError('Ocurrió un error al actualizar el evento.');
      throw error;
    }
  };

  const HandleEliminarEvento = async (idEvento: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/calendario/${idEvento}/marcar-eliminado`, {
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

      if (removeEventFromState) {
        removeEventFromState(idEvento);
      }

      onSuccess('Evento eliminado con éxito');
    } catch (error: any) {
      console.error('Error eliminando evento:', error);
      onError(`No se pudo eliminar el evento. ${error.message}`);
    }
  };

  return {
    combinarFechaYHora,
    obtenerHoraDesdeFecha,
    crearEvento,
    actualizarEvento,
    HandleEliminarEvento,
  };
}
