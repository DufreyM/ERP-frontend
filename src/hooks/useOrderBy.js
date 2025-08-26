/**
 * SU USO REQUIERE DEL COMPONENTE src/components/OrderBy/OrderBy.jsx
 * Hook personalizado para ordenar datos según una opción seleccionada.
 * ejemplo de como se llama 
 * const {sortedData, sortOption, setSortOption} = useOrderBy({data: datosFiltrados, sortKeyMap});
 *
 * @param {Array} data - Lista de elementos a ordenar.
 * 
 * @param {Object} sortKeyMap - Mapa que relaciona opciones de ordenamiento (como "AZ", "ZA", etc.)
 *                              con la clave del objeto que debe usarse para ordenar.
 * ejemplo de uso con todos los filtros disponibles actualmente, si no se usa uno, no es necesario incluirlo
 * const sortKeyMap = {
    AZ: "nombreProducto",
    ZA: "nombreProducto",
    STOCK_HIGH: "existencias",
    STOCK_LOW: "existencias",
    PRICE_HIGH: "precio",
    PRICE_LOW: "precio",
    DATE_NEW: "fechaCreacion",
    DATE_OLD: "fechaCreacion",
    };
 *
 * @returns {Object} {
 *   sortedData: array de datos ordenados,
 *   sortOption: opción actual de ordenamiento,
 *   setSortOption: función para cambiar la opción.
 */

import { useState, useMemo } from "react";

export const useOrderBy = ({
    data,
    sortKeyMap
}) => {
    // Estado interno: opción seleccionada para ordenar. Por defecto, orden alfabético A-Z.
    const [sortOption, setSortOption] = useState("AZ"); 

    /**
    * Memoriza el resultado del ordenamiento para evitar cálculos innecesarios.
    * Solo se recalcula cuando cambian: los datos, la opción de ordenamiento o el mapa de claves.
    */
    const sortedData = useMemo(() => {
        const sorted = [...data];
        const key = sortKeyMap[sortOption];

        if (!key) return sorted;

        // Lógica de ordenamiento según cada opción
        switch (sortOption) {
            case "AZ":
                return sorted.sort((a, b) => a[key].localeCompare(b[key]));
            case "ZA":
                return sorted.sort((a, b) => b[key].localeCompare(a[key]));
            case "STOCK_HIGH":
            case "PRICE_HIGH":
                return sorted.sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
            case "STOCK_LOW":
            case "PRICE_LOW":
                return sorted.sort((a, b) => (a[key] ?? 0) - (b[key] ?? 0));
            case "DATE_NEW":
                return sorted.sort((a, b) => new Date(b[key]) - new Date(a[key]));
            case "DATE_OLD":
                return sorted.sort((a, b) => new Date(a[key]) - new Date(b[key]));
            default:
                return sorted;
            }
    }, [data, sortOption, sortKeyMap]);

    // Retornás los datos ordenados y los métodos necesarios para cambiar la opción de ordenamiento.
    return {
        sortedData,
        sortOption,
        setSortOption,
    };
}
