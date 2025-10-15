import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faUser, faEnvelope, faCalendar, faGear, faHouse, faLockOpen} from '@fortawesome/free-solid-svg-icons';
import IconoInput from '../../components/Inputs/InputIcono';
import InputPassword from '../../components/Inputs/InputPassword';
import InputSelects from '../../components/Inputs/InputSelects';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import SimpleTitle from '../../components/Titles/SimpleTitle';
import { getOptions } from '../../utils/selects';
import InputDates from '../../components/Inputs/InputDates';

const RegisterScreen = () =>  {
    const [errorMessage, setErrorMessage] = useState('');
    const [username, setUsername] = useState('');
    const [userlastname, setUserlastname] = useState('');
    const [useremail, setUseremail] = useState('');
    const [birth, setBirth] = useState(null);
    const [rol, setRol] = useState('');
    const [local, setLocal] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [opcionsLocal, setOpcionsLocal] = useState([]);
    const [opcionsRoles, setOpcionsRoles] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        getOptions("http://localhost:3000/api/roles", item => ({
            value: item.id,
            label: item.nombre,
        })).then(setOpcionsRoles);

    }, []);

    useEffect(() => {
        getOptions("http://localhost:3000/api/locales", item => ({
            value: item.id,
            label: item.nombre,
        })).then(setOpcionsLocal);

    }, []);

    const handleNameChange = (e) => {
        setUsername(e.target.value);
        setErrorMessage('');
    };

    const handleLastNameChange = (e) => {
        setUserlastname(e.target.value);
        setErrorMessage('');
    };

    const handleEmailChange = (e) => {
        setUseremail(e.target.value);
        setErrorMessage('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrorMessage('');
    };

    const handleBirthChange = (date) => {
        
        setBirth(date); // Actualiza el estado de la fecha
        const age = calculateAge(date);

        if (age < 18){
            setErrorMessage('Debe ser mayor de 18 años para registrar al usuario.');
        } else if (date) {
            setErrorMessage('');  // Si todos los campos están completos, limpia el mensaje de error
        } else {
            setErrorMessage('Por favor, completa todos los campos'); // Si falta algo, muestra el error
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRolChange = (e) => {
        setRol(e.target.value);
        setErrorMessage('');
    };

    const handleLocalChange = (e) => {
        setLocal(e.target.value);
        setErrorMessage('');
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        if (month < birth.getMonth() || (month === birth.getMonth() && day < birth.getDate())) {
            age--;
        }

        return age;
    };


    const handleRegister = async () => {
    if (!username || !password || !useremail || !userlastname || !birth || !rol) {
        setErrorMessage('Por favor, completa todos los campos');
        return;
    }
    if (calculateAge(birth) < 18) {
        setErrorMessage('Debe ser mayor de 18 años para registrar al usuario.');
        return;
    }

    setErrorMessage('');

    const payload = {
        nombre: username,
        apellidos: userlastname,
        rol_id: rol,
        email: useremail,
        contrasena: password,
        fechaNacimiento: birth,
    };

    // Si el rol no es visitador médico (id 3), agrega el local
    if (rol !== "3" && local) {
        payload.local = local;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.error || 'Error al registrar el usuario');
            return;
        }

        // Registro exitoso
        setErrorMessage('');
        alert('Usuario registrado correctamente. Se ha enviado un correo de verificación.');
        navigate('/'); //Cambiar para cuando sepamos a dónde redirigir después del registro
    } catch (error) {
        setErrorMessage('Error de red o del servidor');
    }
};

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative', 
                width: '100%',
                maxWidth: '600px',
            }}
        >
            

            <SimpleTitle
                text = "Crear nuevo usuario"
            ></SimpleTitle>
            
            <SimpleTitle
                text = "Completa los datos para continuar"
            ></SimpleTitle>

            {/*Mensaje de error*/
                errorMessage && (
                    <div style={{ 
                        color: 'red', 
                        marginTop: '10px', 
                        fontFamily:'sans-serif', 
                        fontSize: '15px'
                    }}>
                        {errorMessage}
                    </div>
                )
            }

            {/* Casilla de Nombre */}
            <IconoInput
                icono={faUser}
                placeholder="Nombres"
                value={username}
                error={errorMessage}
                onChange={handleNameChange}
                name="email">
       
            </IconoInput>

            {/* Casilla de Apellidos */}
            <IconoInput
                icono={faUser}
                placeholder="Apellidos"
                value={userlastname}
                error={errorMessage}
                onChange={handleLastNameChange}
                name="email">
       
            </IconoInput>

            {/* Casilla de correo */}
            <IconoInput
                icono={faEnvelope}
                placeholder="Correo"
                value={useremail}
                error={errorMessage}
                onChange={handleEmailChange}
                name="email">
       
            </IconoInput>

            {/* Casilla de nacimiento*/}
            <InputDates
                icono = {faCalendar}
                placeholder="Fecha de Nacimiento"
                selected={birth}
                onChange={handleBirthChange}
                error={errorMessage}
            >
            </InputDates>

            {/* Casilla de Rol */}
            <InputSelects
                icono={faGear}
                placeholder="Tipo de rol"
                value={rol}
                error={errorMessage}
                onChange={handleRolChange}
                name="email"
                opcions={opcionsRoles}
                >
        
            </InputSelects>

            {/* Casilla de local */}
            <InputSelects
                icono={faHouse}
                placeholder="Local Asignado"
                value={local}
                error={errorMessage}
                onChange={handleLocalChange}
                name="email"
                opcions={opcionsLocal}
                >
        
            </InputSelects>

            <InputPassword
                showPassword={showPassword}
                togglePasswordVisibility = {togglePasswordVisibility}
                icono={faLockOpen}
                placeholder="Contraseña temporal"
                value={password}
                error={errorMessage}
                onChange={handlePasswordChange}
                name="password"
                >
            </InputPassword>

            <ButtonForm
                text = 'Crear Usuario'
                onClick = {handleRegister}
            >
            </ButtonForm>

            
            
        </div>
    );
};

export default RegisterScreen;