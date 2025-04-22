/*
LoginScreen
Contenedores de la pantalla de inicio de sesión
Contiene el input de nombre de usuario y su respectivo estado
Contiene el input de contraseña y su respectivo estado
Contiene el icono de mostrar/ocultar contraseña y su respectivo estado
Contiene el texto de reestablecimiento de contraseña y su respectivo estado (también redirige a la página de reestablecimiento)
Contiene el estilo de los inputs
Autor: Daniela 
Ultima modificación: 21/04/2025
*/

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importar hook para navegación

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Hook para redirigir

    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleResetPassword = () => {
        navigate('/reset-password'); // Redirigir a la página de reestablecimiento
    };

    const inputStyle = {
        padding: '8px',
        width: '100%',
        maxWidth: '300px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '10px',
        boxSizing: 'border-box', 
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            {/* Casilla de Usuario */}
            <input
                type="text"
                id="username"
                value={username}
                onChange={handleInputChange}
                placeholder="Nombre de usuario"
                style={inputStyle}
            />
            {/* Casilla de contraseña con ícono */}
            <div
                style={{
                    position: 'relative',
                    maxWidth: '300px',
                    width: '100%',
                    marginBottom: '10px',
                }}
            >
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Contraseña"
                    style={{
                        ...inputStyle,
                        paddingRight: '40px', // Espacio adicional para el ícono
                        marginBottom: '0',
                    }}
                />
                <span
                    onClick={togglePasswordVisibility}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
            </div>
            {/* Texto de reestablecimiento */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span style={{ color: '#003366' }}>
                    ¿Has olvidado tu contraseña?{' '}
                    <span
                        onClick={handleResetPassword}
                        style={{
                            fontWeight: 'bold',
                            color: '#003366',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                    >
                        Reestablecer
                    </span>
                </span>
            </div>
        </div>
    );
};

export default LoginScreen;