import React, { useState } from 'react';
import BackgroundCross from '../../components/BackgroundCross/BackgroundCross';
import IconoInput from '../../components/Inputs/InputIcono';
import InputPassword from '../../components/Inputs/InputPassword';
import InputDates from '../../components/Inputs/InputDates';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faLock, faEnvelope, faPhone, faNotesMedical, faLocationDot } from '@fortawesome/free-solid-svg-icons';

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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = () => {
        const data = {
            nombre,
            apellido,
            fecha,
            password,
            email,
            telefono,
            proveedor,
            direccion,
            emailProveedor,
            telefonoProveedor,
        };

        console.log('Datos listos para enviar al backend:', JSON.stringify(data));
        setMessage('Datos enviados correctamente.');
    };

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
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h1 style={{ color: '#5a60a5', fontFamily: 'Segoe UI', fontWeight: 'bold', margin: 0 }}>
                        Acceso para
                    </h1>
                    <h1 style={{ color: '#5a60a5', fontFamily: 'Segoe UI', fontWeight: 'bold', margin: 0 }}>
                        Visitadores Médicos
                    </h1>
                </div>

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