import React, { useState } from 'react';
import BackgroundCross from '../../components/BackgroundCross/BackgroundCross';
import IconoInput from '../../components/Inputs/InputIcono';
import InputPassword from '../../components/Inputs/InputPassword';
import InputDates from '../../components/Inputs/InputDates';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faLock, faEnvelope, faPhone, faNotesMedical, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Isotipo from '../../assets/svg/isotipoEconofarma.svg'; 
import { useNavigate } from 'react-router-dom';
import ButtonText from '../../components/ButtonText/ButtonText';

const Visitadores = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fecha, setFecha] = useState(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [direccion, setDireccion] = useState('');
    const [emailProveedor, setEmailProveedor] = useState('');
    const [telefonoProveedor, setTelefonoProveedor] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        setError('');
        setMessage('');

        let fechaFormateada = null;
        if (fecha instanceof Date && !isNaN(fecha)) {
            const year = fecha.getFullYear();
            const month = String(fecha.getMonth() + 1).padStart(2, '0');
            const day = String(fecha.getDate()).padStart(2, '0');
            fechaFormateada = `${year}-${month}-${day}`;
        }

        const data = {
            nombre,
            apellido,
            fechaNacimiento: fechaFormateada,
            password,
            email,
            telefono,
            proveedor,
            direccion,
            emailProveedor,
            telefonoProveedor,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register-visitador`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar al visitador');
            }

            setMessage('Solicitud enviada correctamente. Revisa tu correo.');
        } catch (err) {
            console.error('Error al enviar solicitud de registro:', err);
            setError('No se pudo enviar la solicitud. Verifica los datos e intenta nuevamente.');
        }
    };

    const handleRedirectToLogin = () => {
        navigate('/'); // Redirigir a la página de inicio de sesión
    }

    return (
        <BackgroundCross variant="green" mirrored={true}>
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
                {/* Título */}
                <div style={{ display: 'flex', marginBottom: '0px', gap: '18px',textAlign: 'left' }}>
                    <img
                        src={Isotipo}
                        alt="Isotipo Econofarma"
                        style={{
                            width: 120,
                            height: 120,
                            minWidth: 120,
                        }}
                    />
                    <h1 style={{ color: '#5a60a5', fontFamily: 'Segoe UI', fontWeight: 'bold', margin: 0 }}>
                            Acceso para Visitadores Médicos
                    </h1>  
                </div>

                <h2 style={{ color: '#5a60a5', fontFamily: 'Segoe UI', fontWeight: 'bold', marginBottom: '10px', fontSize: '20px' }}>
                    Datos del visitador
                </h2>

                {/* Inputs */}
                <IconoInput
                    icono={faUser}
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    name="nombre"
                />
                <IconoInput
                    icono={faUser}
                    placeholder="Apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    name="apellido"
                />
                <InputDates
                    icono={faCalendar}
                    placeholder="Fecha de Nacimiento"
                    selected={fecha}
                    onChange={(date) => setFecha(date)}
                />
                <InputPassword
                    showPassword={showPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                    icono={faLock}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                />
                <IconoInput
                    icono={faEnvelope}
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                />
                <IconoInput
                    icono={faPhone}
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    name="telefono"
                />

                <h2 style={{ color: '#5a60a5', fontFamily: 'Segoe UI', fontWeight: 'bold', margin: '25px 0 10px 0', fontSize: '20px', alignSelf: 'flex-middle' }}>
                    Datos del proveedor
                </h2>

                <IconoInput
                    icono={faNotesMedical}
                    placeholder="Nombre del Proveedor"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    name="proveedor"
                />
                <IconoInput
                    icono={faLocationDot}
                    placeholder="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    name="direccion"
                />
                <IconoInput
                    icono={faEnvelope}
                    placeholder="Correo del Proveedor"
                    value={emailProveedor}
                    onChange={(e) => setEmailProveedor(e.target.value)}
                    name="emailProveedor"
                />
                <IconoInput
                    icono={faPhone}
                    placeholder="Teléfono del Proveedor"
                    value={telefonoProveedor}
                    onChange={(e) => setTelefonoProveedor(e.target.value)}
                    name="telefonoProveedor"
                />

                {/* Botón de enviar */}
                <ButtonForm text="Enviar solicitud para crear cuenta" onClick={handleSubmit} />

                <ButtonText
                texto="¿Ya tienes una cuenta?"
                textoButton="Ir al inicio"
                accion={handleRedirectToLogin}
                />

                {/* Mensaje de éxito o error */}
                {message && (
                    <p style={{ color: '#003366', marginTop: '10px', fontFamily: 'Segoe UI', fontSize: '14px' }}>
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

export default Visitadores;