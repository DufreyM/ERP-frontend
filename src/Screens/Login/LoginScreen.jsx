/*
LoginScreen
Contenedores de la pantalla de inicio de sesión
Contiene el input de nombre de usuario y su respectivo estado
Contiene el input de contraseña y su respectivo estado
Contiene el icono de mostrar/ocultar contraseña y su respectivo estado
Autor: Daniela 
Ultima modificación: 20/04/2025
*/

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{ padding: '20px' }}> {/* Casilla de Usuario*/}
            <input
                type="text"
                id="username"
                value={username}
                onChange={handleInputChange}
                placeholder="Nombre de usuario"
                style={{
                    padding: '8px',
                    width: '100%',
                    maxWidth: '300px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            />
            {/* Casilla de contraseña */}
            <div style={{ position: 'relative', maxWidth: '300px' }}> 
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Contraseña"
                    style={{
                        padding: '8px',
                        width: '100%',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />
                <span
                    onClick={togglePasswordVisibility} //funcion para mostrar/ocultar contraseña
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                >
                    {/* Icono de mostrar/ocultar contraseña */}
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} /> 
                </span>
            </div>
        </div>
    );
};

export default LoginScreen;