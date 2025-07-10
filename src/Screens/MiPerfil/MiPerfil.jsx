import React, { useState, useEffect } from "react";
import IconoInput from "../../components/Inputs/InputIcono";
import InputSelects from "../../components/Inputs/InputSelects";
import InputDates from "../../components/Inputs/InputDates";
import InputPassword from "../../components/Inputs/InputPassword";
import ButtonForm from "../../components/ButtonForm/ButtonForm";
import ButtonText from "../../components/ButtonText/ButtonText";
import SimpleTitle from "../../components/Titles/SimpleTitle";
import { removeToken, getToken } from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

import { faUser, faEnvelope, faLock, faBirthdayCake, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import styles from './MiPerfil.module.css';

const MiPerfil = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    genero: "",
    fechaNacimiento: null,
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState("");

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

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, fechaNacimiento: date }));
  };

  const handleSubmit = () => {
    console.log("Datos del perfil:", formData);
  };

  const handleLogout = () => {
    removeToken();
    // Redirigir al login
    window.location.href = '/';
  };

  return (
    <div className={styles.container}>
      <SimpleTitle text="Mi Perfil" />
      
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
        
        <h2 className={styles.nombre}>{formData.nombre || "Nombre de usuario"}</h2>
        <p className={styles.puesto}>{userRole}</p>
      </div>

      <IconoInput
        icono={faUser}
        placeholder="Nombre completo"
        value={formData.nombre}
        onChange={handleChange}
        type="text"
        name="nombre"
      />

      <IconoInput
        icono={faEnvelope}
        placeholder="Correo electrónico"
        value={formData.correo}
        onChange={handleChange}
        type="email"
        name="correo"
      />

      <InputSelects
        icono={faVenusMars}
        placeholder="Selecciona tu género"
        value={formData.genero}
        onChange={handleChange}
        name="genero"
        opcions={[
          { label: "Masculino", value: "masculino" },
          { label: "Femenino", value: "femenino" },
          { label: "Otro", value: "otro" },
        ]}
      />

      <InputDates
        icono={faBirthdayCake}
        placeholder="Fecha de nacimiento"
        selected={formData.fechaNacimiento}
        onChange={handleDateChange}
      />

      <InputPassword
        icono={faLock}
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        name="password"
        showPassword={showPassword}
        togglePasswordVisibility={() => setShowPassword(!showPassword)}
      />

      <div className={styles.buttonContainer}>
        <ButtonForm
          text="Actualizar perfil"
          onClick={handleSubmit}
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
