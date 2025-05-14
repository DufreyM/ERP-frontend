/*
LoginScreen
Contenedores de la pantalla de inicio de sesión
Contiene el input de nombre de usuario y su respectivo estado
Contiene el input de contraseña y su respectivo estado
Contiene el icono de mostrar/ocultar contraseña y su respectivo estado
Contiene el texto de reestablecimiento de contraseña y su respectivo estado (también redirige a la página de reestablecimiento)
Contiene el estilo de los inputs y el botón de iniciar sesión conectado a la API
Autor: Daniela y Melisa
Ultima modificación: 13/05/2025
*/

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Hook para navegación
import { login, storeToken } from '../../services/authService'; // Servicio de autenticación
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import IconoInput from '../../components/Inputs/InputIcono';
import InputPassword from '../../components/Inputs/InputPassword';
import ButtonText from '../../components/ButtonText/ButtonText';
import Header from './Header';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook para redirigir
    
    
    const handleVisitador = () => {
        navigate('/visitador'); 
    };

    const handleInputChange = (e) => {
        setEmail(e.target.value);
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


    const handleLogin = async () => {
        // Validación de campos vacíos
        if (!email || !password) {

            setErrorMessage('Por favor, completa todos los campos');
            return;
        }

        try {
            // Llamada al servicio de login
            const data = await login(email, password);
            const { token } = data;

            // Almacenar el token en localStorage
            storeToken(token);

            // Decodificar el token para obtener el rol y el nombre del usuario
            const payload = JSON.parse(atob(token.split('.')[1]));
            const { rol_id, email: userEmail } = payload;

            // Redirigir según el rol
            switch (rol_id) {
                case 1: // Admin
                    navigate('/dashboard/admin', { state: { user: userEmail, role: 'Admin' } });
                    break;
                case 2: // Dependienta
                    navigate('/dashboard/dependienta', { state: { user: userEmail, role: 'Dependienta' } });
                    break;
                case 3: // Visitador
                    navigate('/dashboard/visitador', { state: { user: userEmail, role: 'Visitador' } });
                    break;
                case 4: // Contador
                    navigate('/dashboard/contador', { state: { user: userEmail, role: 'Contador' } });
                    break;
                default:
                    navigate('/dashboard', { state: { user: userEmail, role: 'Usuario' } });
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setErrorMessage('Correo electrónico o contraseña incorrectos.');
        }
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
                height: '100vh',
            }}
        >
            {/* Header */}
            <Header />
            
            {/* Mensaje de error */}
            {errorMessage && (
                <div
                    style={{
                        color: 'red',
                        marginTop: '10px',
                        fontFamily: 'sans-serif',
                        fontSize: '15px',
                    }}
                >
                    {errorMessage}
                </div>
            )}

            {/* Casilla de correo */}
            <IconoInput
                icono={faEnvelope}
                placeholder="Correo"
                value={email}
                error={!!errorMessage}
                onChange={handleInputChange}
                name="email"
            />

            {/* Casilla de contraseña con ícono */}
            <InputPassword
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                icono={faLock}
                placeholder="Contraseña"
                value={password}
                error={!!errorMessage}
                onChange={handlePasswordChange}
                name="password"
            />

            {/* Texto de reestablecimiento */}
            <ButtonText
                texto="¿Has olvidado tu contraseña?"
                textoButton="Reestablecer"
                accion={handleResetPassword}
            />

            {/* Botón de Iniciar Sesión */}
            <ButtonForm text="Iniciar Sesión" onClick={handleLogin} />

            {/* Texto de visitador médico */}
            <ButtonText
                texto="¿Eres visitador médico?"
                textoButton="Ingresa"
                accion={handleVisitador}
            />

        </div>
    );
};

export default LoginScreen;