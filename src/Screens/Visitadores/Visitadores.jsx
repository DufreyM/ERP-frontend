import React, { useState } from 'react';
import BackgroundCross from '../../components/BackgroundCross/BackgroundCross';
import IconoInput from '../../components/Inputs/InputIcono';
import InputPassword from '../../components/Inputs/InputPassword';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faPhone, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import Isotipo from '../../assets/svg/isotipoEconofarma.svg'; 
import { useNavigate } from 'react-router-dom';
import ButtonText from '../../components/ButtonText/ButtonText';

const Visitadores = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [documentos, setDocumentos] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const pdfFiles = files.filter(file => file.type === 'application/pdf');
        
        if (pdfFiles.length !== files.length) {
            setError('Solo se permiten archivos PDF');
            return;
        }
        
        setDocumentos(pdfFiles);
        setError('');
    };

    const handleSubmit = async () => {
        setError('');
        setMessage('');

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('apellido', apellido);
        formData.append('password', password);
        formData.append('email', email);
        formData.append('telefono', telefono);
        formData.append('proveedor', proveedor);
        
        // Agregar documentos
        documentos.forEach((doc, index) => {
            formData.append(`documentos`, doc);
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register-visitador`, {
                method: 'POST',
                body: formData,
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
                    Datos
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
                    icono={faUser}
                    placeholder="Nombre del Proveedor"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    name="proveedor"
                />

                {/* Input para subir documentos PDF */}
                <div style={{ 
                    width: '100%', 
                    maxWidth: '400px', 
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#5a60a5',
                        fontFamily: 'Segoe UI',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        cursor: 'pointer'
                    }}>
                        <FontAwesomeIcon icon={faFilePdf} style={{ color: '#5a60a5' }} />
                        Subir Documentos (PDF)
                    </label>
                    <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '2px dashed #5a60a5',
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            color: '#5a60a5',
                            cursor: 'pointer'
                        }}
                    />
                    {documentos.length > 0 && (
                        <div style={{ 
                            marginTop: '10px', 
                            fontSize: '12px', 
                            color: '#5a60a5',
                            textAlign: 'center'
                        }}>
                            {documentos.length} archivo(s) seleccionado(s)
                        </div>
                    )}
                </div>

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