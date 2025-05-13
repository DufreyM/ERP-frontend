import React, { useState } from 'react';
import BackgroundCross from '../../components/BackgroundCross/BackgroundCross';
import IconoInput from '../../components/Inputs/InputIcono';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/request-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al enviar el correo');
            }

            setMessage('Hemos mandado un correo para que puedas cambiar tu contraseña.');
        } catch (err) {
            console.error('Error al solicitar cambio de contraseña:', err);
            setError('No se pudo enviar el correo. Por favor, intenta nuevamente.');
        }
    };

    return (
        <BackgroundCross
            variant="red" mirrored={true}
        >
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
                {/* Contenedor del título */}
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <h1 style={{ color: '#5a60a5', fontFamily: 'Segoe UI', fontWeight: 'bold', margin: 0 }}>
                        Restablece tu
                    </h1>
                    <h1 style={{ color: '#5a60a5', fontFamily: 'Segoe UI', fontWeight: 'bold', margin: 0 }}>
                        contraseña
                    </h1>
                </div>

                {/* Casilla de correo */}
                <IconoInput
                    icono={faEnvelope}
                    placeholder="Ingresa tu correo"
                    value={email}
                    error={!!error}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                />

                {/* Botón de Enviar correo */}
                <ButtonForm text="Enviar correo" onClick={handleSubmit} marginBottom="20px" />

                {/* Mensaje de éxito o error */}
                {message && (
                    <p style={{ color: '#003366', marginTop: '-10px', fontFamily: 'Segoe UI', fontSize: '14px' }}>
                        {message}
                    </p>
                )}
                {error && (
                    <p style={{ color: 'red', marginTop: '10px', fontFamily: 'Segoe UI', fontSize: '14px' }}>
                        {error}
                    </p>
                )}
            </div>
        </BackgroundCross>
    );
};

export default ResetPassword;