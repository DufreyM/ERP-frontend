/*
LoginScreen
Contenedores de la pantalla de inicio de sesión
Contiene el input de nombre de usuario y su respectivo estado
Contiene el input de contraseña y su respectivo estado
Contiene el icono de mostrar/ocultar contraseña y su respectivo estado
Contiene el texto de reestablecimiento de contraseña y su respectivo estado (también redirige a la página de reestablecimiento)
Contiene el estilo de los inputs y el botón de iniciar sesión
Autor: Daniela y Melisa
Ultima modificación: 22/04/2025
*/

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importar hook para navegación

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook para redirigir

    const handleInputChange = (e) => {
        setUsername(e.target.value);
        setErrorMessage('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrorMessage('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleResetPassword = () => {
        navigate('/reset-password'); // Redirigir a la página de reestablecimiento
    };

    const handleLogin = () => {
        //validaciones para errores
        if (!username || !password){
            setErrorMessage('Por favor, completa todos los campos');
            return;
        }

        //simulacion de login
        if (username === 'admin' &&password === '1234'){
            setErrorMessage('');
            console.log('Inicio de sesión exitoso')
            //agregar la redireccion cuando se tenga
        } else {
            setErrorMessage('Correo electronico o contraseña incorrectos.')
        }
       
    };

    const inputStyle = {
        padding: '8px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '10px',
        boxSizing: 'border-box',
    };

    const buttonStyle = {
        backgroundColor: '#5a60A5',
        color: 'white',
        border: 'none',
        borderRadius: '20px', // Esquinas más redondeadas
        padding: '10px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold', 
        width: '100%', 
        maxWidth: '300px',
        marginTop: '20px',
        transition: 'background-color 0.3s ease', // Transición para el hover
        boxSizing: 'border-box', 
    };

    const buttonHoverStyle = {
        backgroundColor: '#4a5095', // Color más oscuro al hacer hover
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative', 
                width: '100%',
                maxWidth: '600px',
                zIndex: 2, //Ponerlo encima de los elementos del fondo
            }}
        >
            {/*Mensaje de error*/
                errorMessage && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                        {errorMessage}
                    </div>
                )
            }

            {/* Casilla de correo */}
            <div
                style={{
                    position: 'relative',
                    maxWidth: '400px',
                    width: '100%',
                    marginBottom: '10px',
                }}
            >
            <input
                type="text"
                id="username"
                value={username}
                onChange={handleInputChange}
                placeholder="Correo"
                style={{
                    ...inputStyle,
                    paddingLeft: '40px',
                    border: errorMessage ? '1px solid red' : inputStyle.border,

                }}
            />
                <span
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '40%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        userSelect: 'none',
                        color: '#5a60a5'
                    }}
                    >
                        <FontAwesomeIcon icon={faEnvelope} style={{ color: errorMessage ? 'red' : '#5a60a5' }} />

                </span>

            </div>    
            
            {/* Casilla de contraseña con ícono */}
            <div
                style={{
                    position: 'relative',
                    maxWidth: '400px',
                    width: '100%',
                    marginBottom: '10px',
                }}
            >
                <span
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        userSelect: 'none',
                        color: '#5a60a5'
                    }}
                    >
                        <FontAwesomeIcon icon={faLock} style={{ color: errorMessage ? 'red' : '#5a60a5' }} />

                </span>

                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Contraseña"
                    style={{
                        ...inputStyle,
                        paddingLeft: '40px',
                        paddingRight: '40px', // Espacio adicional para el ícono
                        marginBottom: '0',
                        border: errorMessage ? '1px solid red' : inputStyle.border,
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
                        color: '#5a60a5'
                    }}
                >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} style={{ color: errorMessage ? 'red' : '#5a60a5' }} />

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



            {/* Botón de Iniciar Sesión */}
            <button
                onClick={handleLogin}
                style={buttonStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
            >
                Iniciar Sesión
            </button>

            {/* Texto de visitador médico */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span style={{ color: '#003366' }}>
                    ¿Eres visitador médico?{' '}
                    <span
                        onClick={handleResetPassword}
                        style={{
                            fontWeight: 'bold',
                            color: '#003366',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                    >
                        Ingresa
                    </span>
                </span>
            </div>

        </div>
    );
};

export default LoginScreen;