//LoginBackground
//Conforma el todo el fondo de la pantalla de login, se vincula con Loginbackground.css 
//Autor: Melisa 
//Ultima modificación: 20/4/2025 

import React from "react";
import './LoginBackground.css'

const Background = ({ children }) => {

    return (
        <div className="background">
            <div className="groupCross">
                <div className="cross blue big" />
                <div className="cross blue big" />
                <div className="cross blue medium" />
                <div className="cross blue medium" />
                <div className="cross blue small" />
                <div className="cross blue small" />
                <div className="cross red small">
                    <div  className="smallCross white"/>
                </div>
                <div className="cross red medium">
                    <div  className="smallCross white"/>
                </div>
                <div className="cross red big">
                    <div  className="smallCross white"/>
                </div>
        
            </div>

            <div className="content">
                {children}
            </div>

        </div>
    );
};

export default Background;