/* useOpcionsCalendarForm
Hook personalizado para obtener y almacenar las opciones del formulario del calendario:
  - Tipos de recordatorio (ej. Visita médica, reunión, etc.)
  - Estados del evento (ej. Pendiente, completado, cancelado)
  - Visitadores médicos disponibles según el local seleccionado

Este hook se usa para llenar los `<select>` del formulario de creación/edición de eventos en el calendario.

Atributos:
  - localSeleccionado: número (obligatorio) → ID del local para filtrar los visitadores médicos.

Retorna:
  - opcionesTipoRecordatorio: array de objetos con { value, label }
  - opcionesEstados: array de objetos con { value, label }
  - opcionesVisitadores: array de objetos con { value, label }

Dependencias:
  - Este hook depende de `getOptions` (ubicado en `utils/selects.js`) para transformar y obtener los datos de cada endpoint.

Autor: Melisa
Última modificación: 17/08/2025
*/

import { useEffect, useState } from "react";
import { getOptions } from "../../utils/selects";

export const useOpcionsCalendarForm = (localSeleccionado) => {
  const [opcionesTipoRecordatorio, setOpcionesTipoRecordatorio] = useState([]);
  const [opcionesEstados, setOpcionesEstados] = useState([]);
  const [opcionesVisitadores, setOpcionesVisitadores] = useState([]);

  useEffect(() => { 
    getOptions("http://localhost:3000/api/calendario/tipos-evento", i => ({ value: i.id, label: i.nombre }))
      .then(setOpcionesTipoRecordatorio);

    getOptions("http://localhost:3000/api/calendario/estados", i => ({ value: i.id, label: i.nombre }))
      .then(setOpcionesEstados);
      
    getOptions(`http://localhost:3000/visitadores/por-local/${localSeleccionado}`, i => ({ value: i.id, label: i.nombre }))
      .then(setOpcionesVisitadores);
  }, [localSeleccionado]);

  return { opcionesTipoRecordatorio, opcionesEstados, opcionesVisitadores };
};
