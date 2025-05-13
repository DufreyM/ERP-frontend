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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importar hook para navegación
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import IconoInput from '../../components/Inputs/InputIcono';
import InputPassword from '../../components/Inputs/InputPassword';
import ButtonText from '../../components/ButtonText/ButtonText';

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

    //Provisional
    const handleRegister = () => {
        navigate('register-user');
    }

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
            }}
        >
            
            {/*Mensaje de error*/
                errorMessage && (
                    <div style={{ 
                        color: 'red', 
                        marginTop: '10px', 
                        fontFamily:'sans-serif', 
                        fontSize: '15px'
                    }}>
                        {errorMessage}
                    </div>
                )
            }
          

            {/* Casilla de correo */}
            <IconoInput 
                icono={faEnvelope}
                placeholder="Correo"
                value={username}
                error={errorMessage}
                onChange={handleInputChange}
                name="email">
            </IconoInput>
          

            {/* Casilla de contraseña con ícono */}
            <InputPassword 
                showPassword={showPassword}
                togglePasswordVisibility = {togglePasswordVisibility}
                icono={faLock}
                placeholder="Contraseña"
                value={password}
                error={errorMessage}
                onChange={handlePasswordChange}
                name="password"
                >
            </InputPassword>


            {/* Texto de reestablecimiento */}
            <ButtonText
                texto = '¿Has olvidado tu contraseña?'
                textoButton= 'Reestablecer'
                accion = {handleResetPassword}
            ></ButtonText>


            {/* Botón de Iniciar Sesión */}
            <ButtonForm
                text={'Iniciar Sesión'}
                onClick={handleLogin}
            ></ButtonForm>


            {/* Texto de visitador médico */}
            <ButtonText
                texto = '¿Eres visitador médico?'
                textoButton= 'Ingresa'
                accion = {handleResetPassword}
            ></ButtonText>

            <ButtonText
                texto = 'Crear una cuenta'
                textoButton= 'Ingresa'
                accion = {handleRegister}
            ></ButtonText>

        </div>
    );
};

export default LoginScreen;