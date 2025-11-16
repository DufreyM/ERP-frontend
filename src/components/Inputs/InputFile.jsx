
import { useState } from 'react';
import styles from './InputIcono.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';


const InputFile = ({
    placeholder,
    onChange,
    accept,
    type= 'file',
    error = false,
    disabled=false,
    id
}) => {

    const [archivo, setArchivo] = useState(null);
    const uniqueId = id || `file-upload-${crypto.randomUUID()}`;
    const [hovering, setHovering] = useState(false);

    const handleDrop =(e) => {
        e.preventDefault();
        setHovering(false);

        const archivos = e.dataTransfer.files;
        if (archivos && archivos.length > 0) {
            const file = archivos[0];
            setArchivo(file);
            onChange?.(file);
        }

    }

    const handleInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setArchivo(file);
        onChange?.(file); 
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault(); 
        setHovering(true);
    };

    const handleDragLeave = () => {
        setHovering(false);
    };

    

    return (
        <div 
            className={`${styles.contenedorInputFile} ${error ? styles.errorInput :''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {archivo ? (
                <p style={{width: '380px', textAlign: 'center'}}>Archivo: {archivo.name}</p>
            ) : (
                <p>Arrastra un archivo aquí o haz clic para seleccionarlo</p>
            )}

            <label htmlFor={uniqueId} className={styles.inputFileStyle}>
            
                <span>
                        <FontAwesomeIcon className={styles.iconoFile}  icon={faCloudArrowUp} style={{ color: error? 'red' : '#2f368998' }} />
                </span>
                Seleccionar archivo 

                <input
                    id={uniqueId}
                    style={{ display: "none" }}
                    type= {type}
                    disabled = {disabled}
                    accept={accept}
                    onChange={handleInputChange}
                    placeholder= {placeholder}
                   
                />
            

            </label>

            
    
        </div>
    );
};

export default InputFile;