import React, { useState, useEffect } from 'react';
import BackgroundCross from '../../components/BackgroundCross/BackgroundCross';
import IconoInput from '../../components/Inputs/InputIcono';
import InputPassword from '../../components/Inputs/InputPassword';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faPhone, faFilePdf, faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import Isotipo from '../../assets/svg/isotipoEconofarma.svg'; 
import { useNavigate } from 'react-router-dom';
import ButtonText from '../../components/ButtonText/ButtonText';
import ButtonIcon from '../../components/ButtonIcon/ButtonIcon';
import { add } from 'date-fns';
import InputFile from '../../components/Inputs/InputFile';

const Visitadores = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [telefonos, setTelefonos] = useState([{ numero: '', tipo: 'móvil' }]);
    const [proveedor, setProveedor] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [documentos, setDocumentos] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Funciones para manejar teléfonos
    const addTelefono = () => {
        setTelefonos([...telefonos, { numero: '', tipo: 'móvil' }]);
    };

    const removeTelefono = (index) => {
        if (telefonos.length > 1) {
            setTelefonos(telefonos.filter((_, i) => i !== index));
        }
    };

    const updateTelefono = (index, field, value) => {
        const updatedTelefonos = telefonos.map((telefono, i) => 
            i === index ? { ...telefono, [field]: value } : telefono
        );
        setTelefonos(updatedTelefonos);
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
        setLoading(true);

        // Validar campos requeridos
        if (!nombre.trim() || !apellido.trim() || !email.trim() || !proveedor.trim() || !fechaNacimiento) {
            setError('Por favor, completa todos los campos requeridos.');
            setLoading(false);
            return;
        }

        // Validar que al menos un teléfono esté completo
        const telefonosCompletos = telefonos.filter(t => t.numero.trim() && t.tipo);
        if (telefonosCompletos.length === 0) {
            setError('Por favor, ingresa al menos un número de teléfono.');
            setLoading(false);
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            setLoading(false);
            return;
        }

        try {
            // Preparar datos según la estructura esperada por el backend
            // El backend usará insertGraph para crear las relaciones
            const visitadorData = {
                proveedor_id: 1, // ID temporal, el backend debería manejar esto
                usuario: {
                    nombre: nombre.trim(),
                    apellidos: apellido.trim(),
                    rol_id: 3, // Asumimos que 3 es el rol de visitador médico
                    email: email.trim(),
                    status: 'inactivo', // Inicialmente inactivo hasta aprobación
                    contrasena: password, // El backend debería manejar el hash
                    fechanacimiento: fechaNacimiento
                },
                telefonos: telefonosCompletos.map(t => ({
                    numero: t.numero.trim(),
                    tipo: t.tipo
                })) // Array de objetos con numero y tipo
            };

            // Prueba con estructura más simple para debug
            const testData = {
                proveedor_id: 1, // ID temporal para prueba
                usuario_id: 1,   // ID temporal para prueba
                telefonos: telefonosCompletos.map(t => `${t.numero.trim()} (${t.tipo})`)
            };

            console.log('Enviando datos del visitador:', visitadorData);
            console.log('JSON stringificado:', JSON.stringify(visitadorData, null, 2));
            console.log('Datos de prueba:', testData);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/visitadores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData) // Usando datos de prueba temporalmente
            });

            let responseData;
            try {
                responseData = await response.json();
            } catch (jsonError) {
                console.error('Error al parsear JSON de respuesta:', jsonError);
                const responseText = await response.text();
                console.error('Respuesta como texto:', responseText);
                throw new Error('Error al procesar respuesta del servidor');
            }
            
            console.log('Respuesta del servidor:', { 
                status: response.status, 
                statusText: response.statusText,
                data: responseData 
            });

            if (!response.ok) {
                console.error('Error completo:', {
                    status: response.status,
                    statusText: response.statusText,
                    responseData,
                    requestData: visitadorData
                });
                throw new Error(responseData.error || responseData.message || `Error al registrar al visitador: ${response.status} ${response.statusText}`);
            }

            setMessage('Solicitud enviada correctamente. El administrador revisará tu solicitud.');
            
            // Limpiar formulario después del éxito
            setNombre('');
            setApellido('');
            setPassword('');
            setEmail('');
            setTelefonos([{ numero: '', tipo: 'móvil' }]);
            setProveedor('');
            setFechaNacimiento('');
            setDocumentos([]);

        } catch (err) {
            console.error('Error al enviar solicitud de registro:', err);
            setError(err.message || 'No se pudo enviar la solicitud. Verifica los datos e intenta nuevamente.');
        } finally {
            setLoading(false);
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
                    formatoAa={true}
                />
                <IconoInput
                    icono={faUser}
                    placeholder="Apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    name="apellido"
                    formatoAa={true}
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
                {/* Sección de Teléfonos */}
                <div style={{ width: '100%', maxWidth: '400px', marginBottom: '16px' }}>
                    <label style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#5a60a5',
                        fontFamily: 'Segoe UI',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                    }}>
                        Teléfonos
                    </label>
                    {telefonos.map((telefono, index) => (
                        <div key={index} style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            marginBottom: '8px',
                            alignItems: 'start',
                         
                        }}>
                            <IconoInput
                                icono={faPhone}
                                placeholder="Número de teléfono"
                                value={telefono.numero}
                                onChange={(e) => updateTelefono(index, 'numero', e.target.value)}
                                name={`telefono_${index}`}
                            />
                            <select
                                value={telefono.tipo}
                                onChange={(e) => updateTelefono(index, 'tipo', e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    border: '2px solid #cccccc8e',
                                    borderRadius: '4px',
                                    backgroundColor: '#ffffff',
                                    color: '#5a60a5',
                                    fontSize: '14px',
                                    minWidth: '100px'
                                }}
                            >
                                <option value="móvil">Móvil</option>
                                <option value="fijo">Fijo</option>
                            </select>
                            {telefonos.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeTelefono(index)}
                                    style={{
                                        background: '#e74c3c',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: 'white',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    <ButtonIcon
                        solid = {true}
                        title={'Agregar Teléfono'}
                        icon = {faPlus}
                        onClick={addTelefono}
                    >
                    </ButtonIcon>
                   
                </div>
                <IconoInput
                    icono={faUser}
                    placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    name="fechaNacimiento"
                    type="date"
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
                        
                    }}>
                        <FontAwesomeIcon icon={faFilePdf} style={{ color: '#5a60a5' }} />
                        Subir Documentos (PDF)
                    </label>
                    

                    <InputFile
                        icon={faPen }
                        placeholder = {"Nombre del archivo"}
                        value = {documentos}
                        accept=".pdf"
                        onChange = {handleFileChange}
                        name = ""
                    >
                    </InputFile>
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
                <ButtonForm 
                    text={loading ? "Enviando..." : "Enviar solicitud para crear cuenta"} 
                    onClick={handleSubmit}
                    disabled={loading}
                />

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