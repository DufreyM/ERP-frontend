import React from "react";
import styles from './SimpleTitle.module.css';

const SimpleTitle = ({
    text
}) => {
    return (
        <div className = {styles.contenedorTitle}>
            <h1 className= {styles.title}>
                {text}
            </h1>
            
        </div>
    );
};

export default SimpleTitle;