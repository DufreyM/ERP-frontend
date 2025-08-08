import React, { useState, useEffect } from "react";
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

  const fetchUserData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) {
        setError("No hay token de autenticación");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/usuario/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const userData = await response.json();
      
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
      setError("Error al cargar los datos del perfil");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
    fetchUserData();
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
        <div className={styles.fotoContainer}>
          <img
            src="/default-user.svg"
            alt="Foto de perfil"
            className={styles.fotoPerfil}
          />
          <div className={styles.iconOverlay}>
            <FontAwesomeIcon icon={faCamera} className={styles.cameraIcon} />
            <span className={styles.cambiarText}>Cambiar</span>
          </div>
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

      <ButtonText
        texto="¿Deseas cerrar sesión?"
        textoButton="Haz clic aquí"
        accion={handleLogout}
      />
    </div>
  );
};

export default MiPerfil;
