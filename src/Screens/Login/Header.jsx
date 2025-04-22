import React from "react";
import Isotipo from '../../assets/svg/isotipoEconofarma.svg';
import Logotipo from '../../assets/svg/logotipoEconofarma.svg';
import './StyleElements.css'


const Header = () => {
    return(
        <div className = "encabezado">
            <img src= {Isotipo} alt="Isotipo" className="isotipo"/>
            <div className="contenedor1">
            <div className="contenedor">
                <h1 className="titulo">Bienvenido a</h1>
                <img src= {Logotipo} alt="Logotipo" className="logotipo"/>
            </div>
            </div>

        </div>
    ); 
};

export default Header;