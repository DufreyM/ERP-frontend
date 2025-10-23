import React, { useState, useEffect, useMemo } from 'react';
import BackgroundCross from '../../components/BackgroundCross/BackgroundCross';
import IconoInput from '../../components/Inputs/InputIcono';
import InputPassword from '../../components/Inputs/InputPassword';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faPhone, faFilePdf, faPlus, faPen, faHouseMedical, faTimes, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Isotipo from '../../assets/svg/isotipoEconofarma.svg'; 
import { useNavigate } from 'react-router-dom';
import ButtonText from '../../components/ButtonText/ButtonText';
import ButtonIcon from '../../components/ButtonIcon/ButtonIcon';
import { add } from 'date-fns';
import InputFile from '../../components/Inputs/InputFile';
import SelectSearch from '../../components/Inputs/SelectSearch';
import { useFetch } from '../../utils/useFetch';
import { getToken } from '../../services/authService';

const Visitadores = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [telefonos, setTelefonos] = useState([{ numero: '', tipo: 'móvil' }]);
    const [proveedorSeleccionadoId, setProveedorSeleccionadoId] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [documentos, setDocumentos] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Obtener proveedores
    const token = getToken();
    const { data: proveedores, loading: loadingProveedores } = useFetch(
        `${import.meta.env.VITE_API_URL}/api/proveedor`,
        {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }
    );

    // Estados para agregar proveedor nuevo
    const [agregandoProveedor, setAgregandoProveedor] = useState(false);
    const [nuevoProveedorNombre, setNuevoProveedorNombre] = useState('');
    const [nuevoProveedorTelefono, setNuevoProveedorTelefono] = useState('');
    const [nuevoProveedorCorreo, setNuevoProveedorCorreo] = useState('');
    const [nuevoProveedorDireccion, setNuevoProveedorDireccion] = useState('');

    // Opciones de proveedores para el select (igual que NuevaCompra)
    const opcionesProveedores = useMemo(() => {
        if (!Array.isArray(proveedores)) return [];
        return proveedores.map(proveedor => ({
            value: String(proveedor.id),
            label: proveedor.nombre,
            ...proveedor
        }));
    }, [proveedores]);

    const proveedorSeleccionado = useMemo(() => {
        return opcionesProveedores.find(p => p.value === proveedorSeleccionadoId) || null;
    }, [proveedorSeleccionadoId, opcionesProveedores]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handlers para nuevo proveedor (igual que NuevaCompra)
    const handleNuevoProveedorNombre = (e) => {
        setNuevoProveedorNombre(e.target.value);
        setError('');
    };

    const handleNuevoProveedorTelefono = (e) => {
        setNuevoProveedorTelefono(e.target.value);
        setError('');
    };

    const handleNuevoProveedorCorreo = (e) => {
        setNuevoProveedorCorreo(e.target.value);
        setError('');
    };

    const handleNuevoProveedorDireccion = (e) => {
        setNuevoProveedorDireccion(e.target.value);
        setError('');
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

    // Función para agregar proveedor nuevo (igual que NuevaCompra)
    const handleAgregarProveedor = async () => {
        try {
            // Validaciones básicas
            if (!nuevoProveedorNombre || !nuevoProveedorTelefono || !nuevoProveedorCorreo || !nuevoProveedorDireccion) {
                setError("Por favor, completa todos los campos del proveedor.");
                return;
            }

            const nuevoProveedor = {
                nombre: nuevoProveedorNombre,
                direccion: nuevoProveedorDireccion,
                correo: nuevoProveedorCorreo,
                telefonos: [
                    {numero: nuevoProveedorTelefono, tipo: "fijo"}
                ]
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/proveedor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(nuevoProveedor)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error al agregar proveedor:", errorText);
                throw new Error("Error al registrar proveedor.");
            }

            const result = await response.json();
            setMessage("¡Proveedor agregado correctamente!");
            
            // Selecciona el proveedor recién creado
            setProveedorSeleccionadoId(String(result.id));

            // Limpia formulario de proveedor nuevo
            setNuevoProveedorNombre('');
            setNuevoProveedorTelefono('');
            setNuevoProveedorCorreo('');
            setNuevoProveedorDireccion('');
            setAgregandoProveedor(false);

        } catch (error) {
            console.error(error.message);
            setError("Ocurrió un error al registrar el proveedor.");
        }
    };

    const handleSubmit = async () => {
        setError('');
        setMessage('');
        setLoading(true);

        // Validar campos requeridos
        if (!nombre.trim() || !apellido.trim() || !email.trim() || !proveedorSeleccionadoId || !fechaNacimiento) {
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
            // Preparar datos según la estructura especificada por el usuario
            const visitadorData = {
                proveedor_id: parseInt(proveedorSeleccionadoId), // Usar el ID del proveedor seleccionado
                usuario: {
                    nombre: nombre.trim(),
                    apellidos: apellido.trim(),
                    email: email.trim(),
                    fechanacimiento: fechaNacimiento,
                    rol_id: 5, // Rol de visitador médico según especificación
                    contrasena: password
                },
                telefonos: telefonosCompletos.map(t => ({
                    numero: t.numero.trim(),
                    tipo: t.tipo
                }))
            };

            console.log('Enviando datos del visitador:', visitadorData);
            console.log('JSON stringificado:', JSON.stringify(visitadorData, null, 2));

            const response = await fetch(`${import.meta.env.VITE_API_URL}/visitadores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitadorData)
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
            
            // Notificar que se creó un nuevo visitador para actualizar la lista en admin
            window.dispatchEvent(new CustomEvent('visitadorCreado', { 
                detail: { visitadorData } 
            }));
            
            // Limpiar formulario después del éxito
            setNombre('');
            setApellido('');
            setPassword('');
            setEmail('');
            setTelefonos([{ numero: '', tipo: 'móvil' }]);
            setProveedorSeleccionadoId('');
            setAgregandoProveedor(false);
            setNuevoProveedorNombre('');
            setNuevoProveedorTelefono('');
            setNuevoProveedorCorreo('');
            setNuevoProveedorDireccion('');
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
                {/* Campo de Proveedor con funcionalidad de agregar nuevo */}
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
                        Proveedor
                    </label>
                    
                    {/* Si está en modo "agregar proveedor nuevo" */}
                    {agregandoProveedor ? (
                        <>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'start' }}>
                                <IconoInput
                                    icono={faHouseMedical}
                                    placeholder="Nombre del nuevo proveedor"
                                    type="text"
                                    value={nuevoProveedorNombre}
                                    onChange={handleNuevoProveedorNombre}
                                    formatoAa={true}
                                />
                                <button
                                    onClick={() => setAgregandoProveedor(false)}
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
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            <IconoInput 
                                icono={faPhone} 
                                placeholder="Teléfono del proveedor" 
                                type="text" 
                                value={nuevoProveedorTelefono}
                                onChange={handleNuevoProveedorTelefono}
                            />

                            <IconoInput 
                                icono={faEnvelope} 
                                placeholder="Correo del proveedor" 
                                type="email" 
                                value={nuevoProveedorCorreo}
                                onChange={handleNuevoProveedorCorreo}
                            />

                            <IconoInput 
                                icono={faLocationDot} 
                                placeholder="Dirección del proveedor" 
                                type="text" 
                                value={nuevoProveedorDireccion}
                                onChange={handleNuevoProveedorDireccion}
                            />

                            <ButtonForm
                                text="Agregar proveedor"
                                onClick={handleAgregarProveedor}
                            />
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'start' }}>
                            <SelectSearch
                                icono={faHouseMedical}
                                placeholder="Nombre del proveedor"
                                value={proveedorSeleccionadoId}
                                onChange={(value) => setProveedorSeleccionadoId(value)}
                                type="text"
                                options={opcionesProveedores}
                                tableStyle={false}
                            />
                            <button
                                onClick={() => {
                                    setAgregandoProveedor(true);
                                    setProveedorSeleccionadoId(''); // limpia el select si vas a agregar
                                }}
                                style={{
                                    background: '#5a60a5',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: 'white',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                    )}
                </div>
                

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