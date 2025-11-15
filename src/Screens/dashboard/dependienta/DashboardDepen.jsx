import React, { useEffect, useState } from 'react';
import { getToken } from '../../../services/authService';
import { useCheckToken } from '../../../utils/checkToken';
import Header from '../../Login/Header';
import styles from './DashboardDepen.module.css';

function decodeTokenUTF8(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error al decodificar token UTF-8:', e);
        return null;
    }
}

const DashboardDepen = () => {
    const checkToken = useCheckToken();
    const token = getToken();

    const [frase, setFrase] = useState('');

    let nombreCompleto = 'Usuario';

    if (token) {
        const payload = decodeTokenUTF8(token);
        if (payload) {
            const { nombre, apellidos, email } = payload;
            nombreCompleto =
                nombre && apellidos
                    ? `${nombre} ${apellidos}`
                    : email?.split('@')[0];
        }
    }

    useEffect(() => {
        const obtenerFrase = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/frases`);
                const data = await response.json();
                setFrase(data.frase || '¡Hoy es un gran día para lograr tus metas!');
            } catch (error) {
                console.error('Error al obtener la frase:', error);
                setFrase('¡Hoy es un gran día para lograr tus metas!');
            }
        };

        obtenerFrase();
    }, []);

    return (
        <div className={styles.base}>
            <div className={styles.headerContainer}>
                <Header />
            </div>

            <div className={styles.welcomeContainer}>
                <h1 className={styles.welcomeText}>Hola, {nombreCompleto} 👋</h1>
                <p className={styles.subText}>¡Que tengas una excelente jornada laboral!</p>

                {frase && (
                    <div className={styles.fraseContainer}>
                        <p className={styles.fraseTexto}>"{frase}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardDepen;
