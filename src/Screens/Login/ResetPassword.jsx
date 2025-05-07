import React, { useState } from 'react';
import IconoInput from '../../components/InputIcono/InputIcono';
import InputPassword from '../../components/InputIcono/InputPassword';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import ButtonForm from '../../components/ButtonForm/ButtonForm';

const ResetPassword = () => {
    const [email,setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrorMessage('');
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Página de Reestablecimiento</h1>
            <p>Pa el siguiente sprinttttt</p>
            <IconoInput 
                icono={faEnvelope}
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email">
            </IconoInput>
          

            <IconoInput 
                icono={faLock}
                placeholder="Contraseña"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email">
            </IconoInput>

            <IconoInput 
                icono={faLock}
                placeholder="Contraseña"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email">
            </IconoInput>

            <InputPassword 
                showPassword={showPassword}
                togglePasswordVisibility = {togglePasswordVisibility}
                icono={faLock}
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
                name="email"
                >
            </InputPassword>
            
            <InputPassword 
                showPassword={showPassword}
                togglePasswordVisibility = {togglePasswordVisibility}
                icono={faLock}
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
                name="email"
                >
            </InputPassword>

            <ButtonForm>

            </ButtonForm>
        </div>
    );
};

export default ResetPassword;