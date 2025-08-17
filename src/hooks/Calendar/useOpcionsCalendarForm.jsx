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
