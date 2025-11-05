/**
 * Componente OrderBy
 * 
 * Muestra un botón desplegable con varias opciones para ordenar una lista de elementos.
 * Las opciones se controlan con props para mostrar u ocultar diferentes criterios.
 *
 * Props:
 * - FAbecedario (bool): Muestra opciones de orden alfabético (A-Z, Z-A).
 * - FExistencias (bool): Muestra opciones para ordenar por cantidad (alta o baja).
 * - FPrecio (bool): Muestra opciones de orden por precio (alto o bajo).
 * - FFecha (bool): Muestra opciones de orden por fecha (reciente o antiguo).
 * - selectedOption (string): Valor actualmente seleccionado como opción de orden.
 * - onChange (function): Función a ejecutar cuando se selecciona una nueva opción.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowDownShortWide, faCalendarDays, faArrowTrendDown, faArrowTrendUp, faArrowDownAZ, faArrowDownZA, faArrowDown19, faArrowDown91} from '@fortawesome/free-solid-svg-icons';
import ButtonDisplay from "../ButtonDisplay/ButtonDisplay"
import Options from "./Options/Options";
import { useState } from "react";

const OrderBy = ({
   
    FAbecedario = true,
    FExistencias = true,
    FPrecio = true,
    FFecha = true,
    selectedOption,
    onChange,

}) => {
    const [panelAbierto, setPanelAbierto] = useState(false);
    
    return (
        <>
      
   
  
    
            <ButtonDisplay
                icon={faArrowDownShortWide}
                title={"Ordenar"}
                abierto = {panelAbierto}
                setAbierto = {setPanelAbierto}
            >
                {FAbecedario ? (
                    <div>
                        <Options
                            icon={faArrowDownAZ}
                            text={"Alfabeticamente ascendente (A - Z)"}
                            onChange = {onChange}
                            value={"AZ"}
                            selected = {selectedOption === "AZ"}
                        />

                        <Options
                            icon={faArrowDownZA}
                            text={"Alfabeticamente descendente (Z - A)"}
                            onChange = {onChange}
                            value={"ZA"}
                            selected = {selectedOption === "ZA"}
                        />
                    </div>
                ) : <div/>}

                {FExistencias ? (
                    <div>
                        <Options
                            icon={faArrowDown91}
                            text={"Mayor cantidad de existencias"}
                            onChange = {onChange}
                            value={"STOCK_HIGH"}
                            selected = {selectedOption === "STOCK_HIGH"}
                        />

                        <Options
                            icon={faArrowDown19}
                            text={"Menor cantidad de existencias"}
                            onChange = {onChange}
                            value={"STOCK_LOW"}
                            selected = {selectedOption === "STOCK_LOW"}
                        />

                    </div>
                ) : <div/>}

                {FPrecio ? (
                    <div>
                        <Options
                            icon={faArrowTrendUp}
                            text={"Precio más alto"}
                            onChange = {onChange}
                            value={"PRICE_HIGH"}
                            selected = {selectedOption === "PRICE_HIGH"}
                        />

                        <Options
                            icon={faArrowTrendDown}
                            text={"Precio más bajo"}
                            onChange = {onChange}
                            value={"PRICE_LOW"}
                            selected = {selectedOption === "PRICE_LOW"}
                        />

                    </div>
                ) : <div/>}

                {FFecha ? (
                    <div>
                       <Options
                            icon={faCalendarDays}
                            text={"Realizado recientemente"}
                            onChange = {onChange}
                            value={"DATE_NEW"}
                            selected = {selectedOption === "DATE_NEW"}
                        />

                        <Options
                            icon={faCalendarDays}
                            text={"Realizado más antiguo"}
                            onChange = {onChange}
                            value={"DATE_OLD"}
                            selected = {selectedOption === "DATE_OLD"}
                        />

                    </div>
                ) : <div/>}

            </ButtonDisplay>
        
        </>
    )
}

export default OrderBy;