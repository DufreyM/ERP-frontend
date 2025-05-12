/*
LoginScreen
Contenedores de la pantalla de inicio de sesión
Contiene el input de nombre de usuario y su respectivo estado
Contiene el input de contraseña y su respectivo estado
Contiene el icono de mostrar/ocultar contraseña y su respectivo estado
Contiene el texto de reestablecimiento de contraseña y su respectivo estado (también redirige a la página de reestablecimiento)
Contiene el estilo de los inputs y el botón de iniciar sesión
Autor: Daniela y Melisa
Ultima modificación: 7/05/2025
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService'; 
import IconoInput from '../../components/Inputs/InputIcono';
import InputPassword from '../../components/Inputs/InputPassword';
import ButtonForm from '../../components/ButtonForm/ButtonForm';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password); // Llama al servicio de autenticación
            console.log('Inicio de sesión exitoso:', data);
            // Redirige al usuario después de un inicio de sesión exitoso
            navigate('/dashboard'); // Cambia '/dashboard' por la ruta deseada
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setErrorMessage('Correo electrónico o contraseña incorrectos.');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                position: 'relative',
                width: '100%',
                maxWidth: '600px',
            }}
        >
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
                icono="faEnvelope"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
            />

            {/* Casilla de contraseña */}
            <InputPassword
                showPassword={false}
                togglePasswordVisibility={() => {}}
                icono="faLock"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
            />

            {/* Botón de inicio de sesión */}
            <ButtonForm text="Iniciar sesión" type="submit" />
        </form>
    );
};

export default LoginScreen;