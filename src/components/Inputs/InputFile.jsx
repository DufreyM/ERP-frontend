
import { useState } from 'react';
import styles from './InputIcono.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';


const InputFile = ({
    placeholder,
    onChange,
    accept,
    error = false,
}) => {

    const [archivo, setArchivo] = useState(null);
    const [hovering, setHovering] = useState(false);

    const handleDrop =(e) => {
        e.preventDefault();
        setHovering(false);

        const archivos = e.dataTransfer.files;
        if (archivos && archivos.length > 0) {
            const file = archivos[0];
            setArchivo(file);
            onChange?.file;
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

            <label htmlFor="file-upload" className={styles.inputFileStyle}>
            
                <span>
                        <FontAwesomeIcon className={styles.iconoFile}  icon={faCloudArrowUp} style={{ color: error? 'red' : '#2f368998' }} />
                </span>
                Seleccionar archivo PDF

                <input
                    id="file-upload" 
                    style={{ display: "none" }}
                    type= 'file'
                    name = {name}
                    
                    accept={accept}
                    onChange={handleInputChange}
                    placeholder= {placeholder}
                   
                />
            

            </label>

            
    
        </div>
    );
};

export default InputFile;