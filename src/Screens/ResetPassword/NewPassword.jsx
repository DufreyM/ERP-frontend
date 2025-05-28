import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackgroundCross from '../../components/BackgroundCross/BackgroundCross';
import InputPassword from '../../components/Inputs/InputPassword';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const NewPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Extraer token y email de la URL
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const email = query.get('email');

    useEffect(() => {
        if (!token || !email) {
            setError('El enlace no es válido o ha expirado.');
        }
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password || !confirmPassword) {
            setError('Por favor, completa ambos campos.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        setSubmitting(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, email, nuevaContrasena: password }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al restablecer la contraseña');
            }
            navigate('/reset-password-success');
        } catch (err) {
            setError(err.message || 'Error al restablecer la contraseña');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <BackgroundCross variant="red" mirrored={true}>
            <form
                onSubmit={handleSubmit}
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
                {/* Título */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{
                        color: '#5a60a5',
                        fontFamily: 'Segoe UI',
                        fontWeight: 'bold',
                        margin: 0,
                        fontSize: '2.2rem',
                        lineHeight: '1.1'
                    }}>
                        Establece tu nueva<br />contraseña
                    </h1>
                </div>

                {/* Inputs */}
                <InputPassword
                    showPassword={showPassword}
                    togglePasswordVisibility={() => setShowPassword((v) => !v)}
                    icono={faLock}
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    name="password"
                    error={!!error}
                />
                <InputPassword
                    showPassword={showConfirmPassword}
                    togglePasswordVisibility={() => setShowConfirmPassword((v) => !v)}
                    icono={faLock}
                    placeholder="Confirmar tu contraseña"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    name="confirmPassword"
                    error={!!error}
                />

                {/* Error */}
                {error && (
                    <p style={{ color: 'red', marginTop: '10px', fontFamily: 'Segoe UI', fontSize: '14px' }}>
                        {error}
                    </p>
                )}

                {/* Botón */}
                <ButtonForm
                    text={submitting ? "Restableciendo..." : "Restablecer contraseña"}
                    onClick={handleSubmit}
                />
            </form>
        </BackgroundCross>
    );
};

export default NewPassword;