// hooks/useFiltroGeneral.js
import { useState, useMemo, useEffect } from "react";

// const sortKeyMap = {
//      const keyPrecio = filterKeyMap["RANGO_PRECIO"];
        // const keyFecha = filterKeyMap["RANGO_FECHA"];
        // const keyUsuario = filterKeyMap["USUARIO"];
        // const keyRol = filterKeyMap["ROL"]; 
//     };

export const useFiltroGeneral = ({ 
    data,
    filterKeyMap,
    //datos para usar rango de precio
    precioMin,
    precioMax,
    //datos para usar rango de fecha
    fechaInicio,
    fechaFin,
    //datos para usar fultrado por usuario
    usuarioId,
    rolId,

    //dato para tipo de medicamento
     tipoMedicamento


}) => {
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    };



    const dataFiltrada = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        // Obtenemos la clave del campo que se usará para el filtro de precio
        const keyPrecio = filterKeyMap["RANGO_PRECIO"];
        const keyFecha = filterKeyMap["RANGO_FECHA"];
        const keyUsuario = filterKeyMap["USUARIO"];
        const keyRol = filterKeyMap["ROL"];

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

                // --- Rol ---
        let cumpleRol = true;
        if (keyRol && rolId) {
            const rolItem = getNestedValue(item, keyRol);
            cumpleRol = String(rolItem) === String(rolId);
        }

        // --- Usuario ---
        let cumpleUsuario = true;
        if (keyUsuario && usuarioId) {
            const usuarioItem = getNestedValue(item, keyUsuario);
            cumpleUsuario = String(usuarioItem) === String(usuarioId);
        }

        // --- Tipo de medicamento ---
        let cumpleTipo = true;
        if (filterKeyMap["TIPO_MEDICAMENTO"] && tipoMedicamento) {
        const tipoItem = getNestedValue(item, filterKeyMap["TIPO_MEDICAMENTO"]);
        cumpleTipo = String(tipoItem) === String(tipoMedicamento);
        }



        return cumplePrecio && cumpleFecha && cumpleRol && cumpleUsuario && cumpleTipo;
        });
    }, [data, precioMin, precioMax, filterKeyMap, fechaInicio,
    fechaFin, usuarioId, rolId, tipoMedicamento]);

    

  return {
    dataFiltrada
  };
};
