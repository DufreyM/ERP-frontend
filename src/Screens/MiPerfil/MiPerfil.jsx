import React, { useState } from "react";
import IconoInput from "../../components/Inputs/InputIcono";
import InputSelects from "../../components/Inputs/InputSelects";
import InputDates from "../../components/Inputs/InputDates";
import InputPassword from "../../components/Inputs/InputPassword";
import ButtonForm from "../../components/ButtonForm/ButtonForm";
import ButtonText from "../../components/ButtonText/ButtonText";
import PerfilHeader from "../../components/Titles/PerfilHeader";

import { faUser, faEnvelope, faLock, faBirthdayCake, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import styles from './MiPerfil.module.css';

const MiPerfil = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    genero: "",
    fechaNacimiento: null,
    password: "",
    descripcion: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <div className={styles.container}>
      <PerfilHeader
        nombre={formData.nombre}
        puesto="Visitador Médico"
        descripcion={formData.descripcion}
        onDescripcionChange={(desc) => setFormData((prev) => ({ ...prev, descripcion: desc }))}
      />

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

      <ButtonForm
        text="Actualizar perfil"
        onClick={handleSubmit}
      />

      <ButtonText
        texto="¿Deseas cerrar sesión?"
        textoButton="Haz clic aquí"
        accion={() => console.log("Cerrar sesión")}
      />
    </div>
  );
};

export default MiPerfil;
