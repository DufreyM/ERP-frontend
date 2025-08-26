import React, { useState, useEffect, useRef } from "react";
import IconoInput from "../../components/Inputs/InputIcono";
import InputSelects from "../../components/Inputs/InputSelects";
import InputDates from "../../components/Inputs/InputDates";
import ButtonForm from "../../components/ButtonForm/ButtonForm";
import ButtonText from "../../components/ButtonText/ButtonText";
import SimpleTitle from "../../components/Titles/SimpleTitle";
import { removeToken, getToken } from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

import { faUser, faEnvelope, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';
import styles from './MiPerfil.module.css';

const MiPerfil = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    fechanacimiento: null,
  });

  const [originalData, setOriginalData] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Función para obtener el rol del usuario desde el token
  const getUserRole = () => {
    try {
      const token = getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const { rol_id } = payload;
        
        // Mapear el rol_id a un nombre legible
        const roleMap = {
          1: "Administradora",
          2: "Dependienta", 
          3: "Visitador Médico",
          4: "Contador"
        };
        
        return roleMap[rol_id] || "Usuario";
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
    return "Usuario";
  };

  // Función para cargar la foto de perfil del usuario
  const fetchProfilePhoto = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/usuario/me/foto-perfil`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.foto_perfil) {
          setProfilePhoto(data.foto_perfil);
        }
      }
    } catch (error) {
      console.error("Error al cargar la foto de perfil:", error);
    }
  };

  // Función para subir una nueva foto de perfil
  const uploadProfilePhoto = async (file) => {
    setUploadingPhoto(true);
    setError("");
    
    try {
      const token = getToken();
      if (!token) {
        setError("No hay token de autenticación");
        return;
      }

      const formData = new FormData();
      formData.append('file', file); // Cambié 'foto' por 'file' para que coincida con el backend

      const response = await fetch(`${API_BASE_URL}/api/usuario/me/upload-pfp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Recargar la foto después de subirla
      await fetchProfilePhoto();
      setSuccess("Foto de perfil actualizada correctamente");
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (error) {
      setError(`Error al subir la foto de perfil: ${error.message}`);
      console.error("Error uploading profile photo:", error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Función para manejar el cambio de archivo
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setError("Por favor selecciona un archivo de imagen válido");
        return;
      }
      
      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen debe ser menor a 5MB");
        return;
      }

      uploadProfilePhoto(file);
    }
  };

  // Función para abrir el selector de archivos
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const fetchUserData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) {
        setError("No hay token de autenticación");
        return;
      }

      console.log('Token found:', token.substring(0, 20) + '...');
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Fetching user data from:', `${API_BASE_URL}/api/usuario/me`);
      
      // Verificar que la URL sea válida
      if (!API_BASE_URL || API_BASE_URL === 'undefined') {
        throw new Error('URL de la API no configurada correctamente');
      }

      const response = await fetch(`${API_BASE_URL}/api/usuario/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          const errorText = await response.text();
          errorMessage = `${errorMessage}: ${errorText}`;
        }
        
        console.error('Error response:', errorMessage);
        throw new Error(errorMessage);
      }

      const userData = await response.json();
      console.log('User data received:', userData);
      
      // Validar que los datos recibidos sean válidos
      if (!userData || typeof userData !== 'object') {
        throw new Error('Respuesta del servidor inválida');
      }
      
      // Mapear datos del backend a la UI
      const mappedData = {
        nombre: userData.nombre || "",
        apellidos: userData.apellidos || "",
        email: userData.email || "",
        fechanacimiento: userData.fechanacimiento ? new Date(userData.fechanacimiento) : null,
      };

      setFormData(mappedData);
      setOriginalData(userData);
    } catch (err) {
      console.error("Error fetching user data:", err);
      
      // Mensajes de error más específicos
      if (err.message.includes('Failed to fetch')) {
        setError("No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.");
      } else if (err.message.includes('401')) {
        setError("Token de autenticación expirado o inválido. Por favor, inicia sesión nuevamente.");
      } else if (err.message.includes('404')) {
        setError("Endpoint no encontrado. Verifica la configuración de la API.");
      } else if (err.message.includes('500')) {
        setError("Error interno del servidor. Intenta más tarde.");
      } else {
        setError(`Error al cargar los datos del perfil: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
    
    // Función para probar la conectividad
    const testConnection = async () => {
      try {
        console.log('Testing connection to:', API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/api/usuario/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Connection test response:', response.status);
      } catch (error) {
        console.error('Connection test failed:', error);
      }
    };
    
    testConnection();
    fetchUserData();
    fetchProfilePhoto();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, fechanacimiento: date }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      if (!token) {
        setError("No hay token de autenticación");
        return;
      }

      // Preparar datos para enviar al backend
      const updateData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        fechanacimiento: formData.fechanacimiento ? formData.fechanacimiento.toISOString().split('T')[0] : null
      };

      // Remover campos vacíos
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === "" || updateData[key] === null) {
          delete updateData[key];
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/usuario/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const updatedUser = await response.json();
      
      // Actualizar datos originales
      setOriginalData(updatedUser);
      setSuccess("Perfil actualizado correctamente");
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      setError("Error al actualizar el perfil");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    // Redirigir al login
    window.location.href = '/';
  };

  const nombreCompleto = `${formData.nombre} ${formData.apellidos}`.trim() || "Nombre de usuario";

  return (
    <div className={styles.container}>
      <SimpleTitle text="Mi Perfil" />
      
      {loading && <div style={{ color: '#5a60a5', fontWeight: 600, marginBottom: 12 }}>Cargando perfil...</div>}
      {error && <div style={{ color: '#e74c3c', fontWeight: 600, marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1bbf5c', fontWeight: 600, marginBottom: 12 }}>{success}</div>}
      
      <div className={styles.profileSection}>
        <div className={styles.fotoContainer} onClick={handlePhotoClick}>
          <img
            src={profilePhoto || "/default-user.svg"}
            alt="Foto de perfil"
            className={styles.fotoPerfil}
          />
          <div className={styles.iconOverlay}>
            <FontAwesomeIcon icon={faCamera} className={styles.cameraIcon} />
            <span className={styles.cambiarText}>
              {uploadingPhoto ? "Subiendo..." : "Cambiar"}
            </span>
          </div>
          {/* Input oculto para seleccionar archivos */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </div>
        
        <h2 className={styles.nombre}>{nombreCompleto}</h2>
        <p className={styles.puesto}>{userRole}</p>
      </div>

      <IconoInput
        icono={faUser}
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        type="text"
        name="nombre"
      />

      <IconoInput
        icono={faUser}
        placeholder="Apellidos"
        value={formData.apellidos}
        onChange={handleChange}
        type="text"
        name="apellidos"
      />

      <IconoInput
        icono={faEnvelope}
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        type="email"
        name="email"
      />

      <InputDates
        icono={faBirthdayCake}
        placeholder="Fecha de nacimiento"
        selected={formData.fechanacimiento}
        onChange={handleDateChange}
      />

      <div className={styles.buttonContainer}>
        <ButtonForm
          text={saving ? "Actualizando..." : "Actualizar perfil"}
          onClick={handleSubmit}
          disabled={saving}
        />
      </div>

      <div className={styles.logoutContainer}>
        <ButtonText
          texto="¿Deseas cerrar sesión?"
          textoButton="Haz clic aquí"
          accion={handleLogout}
        />
      </div>
    </div>
  );
};

export default MiPerfil;
