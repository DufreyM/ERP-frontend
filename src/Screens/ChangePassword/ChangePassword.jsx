import React, { useState } from 'react';
import BackgroundCross from '../../components/BackgroundCross/BackgroundCross';
import InputPassword from '../../components/Inputs/InputPassword';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import ButtonText from '../../components/ButtonText/ButtonText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Isotipo from '../../assets/svg/isotipoEconofarma.svg';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePassword.module.css';
import { changePassword } from '../../services/authService';
import { useCheckToken } from '../../utils/checkToken';

const ChangePassword = () => {
  const checkToken = useCheckToken();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const validatePasswords = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const isFormValid = () => {
    return formData.currentPassword && 
           formData.newPassword && 
           formData.confirmPassword && 
           formData.newPassword === formData.confirmPassword;
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      setSuccess('Contraseña cambiada exitosamente');
      setLoading(false);
      setTimeout(() => {
        navigate('/admin/mi-perfil');
      }, 1500);
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        if (typeof checkToken === 'function') {
          const handled = await checkToken({ status: err.status });
          if (!handled) return;
        } else {
          logout();
          navigate('/', { replace: true });
          return;
        }
      }

      if (err.status === 500) {
        setError("Ocurrió un error interno del servidor, pero la contraseña podría haberse cambiado correctamente. Intenta iniciar sesión de nuevo.");
      }

      setError(err?.message || 'Error al cambiar la contraseña');
      } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/mi-perfil');
  };

  return (
      <div className={styles.container}>
        {/* Logo centrado */}
        <div className={styles.logoContainer}>
          <img
            src={Isotipo}
            alt="Isotipo Econofarma"
            className={styles.logo}
          />
        </div>

        {/* Título */}
        <h1 className={styles.title}>Cambia tu contraseña</h1>

        {/* Formulario */}
        <div className={styles.formContainer}>
          {/* Contraseña anterior */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Contraseña anterior</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={styles.passwordInput}
                placeholder="Ingresa tu contraseña actual"
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => togglePasswordVisibility('current')}
              >
                <FontAwesomeIcon 
                  icon={showPasswords.current ? faEyeSlash : faEye} 
                  className={styles.eyeIcon}
                />
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nueva contraseña</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={styles.passwordInput}
                placeholder="Ingresa tu nueva contraseña"
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => togglePasswordVisibility('new')}
              >
                <FontAwesomeIcon 
                  icon={showPasswords.new ? faEyeSlash : faEye} 
                  className={styles.eyeIcon}
                />
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirmar contraseña</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.passwordInput}
                placeholder="Confirma tu nueva contraseña"
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => togglePasswordVisibility('confirm')}
              >
                <FontAwesomeIcon 
                  icon={showPasswords.confirm ? faEyeSlash : faEye} 
                  className={styles.eyeIcon}
                />
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {/* Mensaje de éxito */}
          {success && (
            <div className={styles.successMessage}>
              {success}
            </div>
          )}

          {/* Botón de cambiar contraseña */}
          <div className={styles.buttonRow}>
            <ButtonForm
              text={loading ? "Cambiando..." : "Cambiar contraseña"}
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
            />
          </div>

          {/* Botón para volver */}
          <div className={styles.buttonTextRow}>
            <ButtonText
              texto="¿Deseas volver al perfil?"
              textoButton="Volver"
              accion={handleGoBack}
            />
          </div>
        </div>
      </div>
  );
};

export default ChangePassword;
