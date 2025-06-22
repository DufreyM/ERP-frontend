//BackgroundCross
//Conforma los fondos de poseen cruces, se vincula con Loginbackground.css 
//Para utilizarlo se define 'children' como el contenido que se utiliza para que quede de fondo
//'variant' es el color que puede toma, por el momento "red" "green"
//'mirrored' refleja el diseño de manera horizontal true o false
//Autor: Melisa 
//Ultima modificación: 7/5/2025 



import React from "react";
import './LoginBackground.css'

const BackgroundCross = ({ 
    children,
    variant = "default",
    mirrored = false,
    className = "",
}) => {

    return (
        <div className ='background'>
           <div className={`groupCrossContainer ${mirrored ? "mirrored" : ""}`}>
           <div className={`groupCross ${variant}`}>
                <div className="cross blue big" />
                <div className="cross blue big" />
                <div className="cross blue medium" />
                <div className="cross blue medium" />
                <div className="cross blue small" />
                <div className="cross blue small" />
                <div className="cross colored small">
                    <div  className="smallCross white"/>
                </div>
                <div className="cross colored medium">
                    <div  className="smallCross white"/>
                </div>
                <div className="cross colored big">
                    <div  className="smallCross white"/>
                </div>
        
            </div>
            </div>
            <div className={`content ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default BackgroundCross;