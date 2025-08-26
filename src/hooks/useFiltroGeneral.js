// hooks/useFiltroGeneral.js
import { useState, useMemo } from "react";

// const sortKeyMap = {
//     FECHA: "nombreProducto",
//     USUARIO: "nombreProducto",
//     TIPO_USUARIO: "existencias",
//     TIPO_MEDICAMENTO: "existencias",
//     RANGO_PRECIO: 
//     };

export const useFiltroGeneral = ({ 
    data,
    filterKeyMap,
    precioMin,
    precioMax,
    fechaInicio,
    fechaFin,

}) => {


    const dataFiltrada = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        // Obtenemos la clave del campo que se usará para el filtro de precio
        const keyPrecio = filterKeyMap["RANGO_PRECIO"];
        const keyFecha = filterKeyMap["RANGO_FECHA"];

        return data.filter(item => {
        // ---- Filtro por precio ----
        let cumplePrecio = true;
        if (keyPrecio && item[keyPrecio] != null) {
            const precio = parseFloat(item[keyPrecio]);
            cumplePrecio =
            (!precioMin || precio >= parseFloat(precioMin)) &&
            (!precioMax || precio <= parseFloat(precioMax));
        }

        // ---- Filtro por fecha ----
        let cumpleFecha = true;
        if (keyFecha && (fechaInicio || fechaFin)) {
            const fechaItem = new Date(item[keyFecha]);
            cumpleFecha =
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin);
        }



            return cumplePrecio && cumpleFecha;
        });
    }, [data, precioMin, precioMax, filterKeyMap, fechaInicio,
    fechaFin,]);

    






  return {
    dataFiltrada
  };
};
