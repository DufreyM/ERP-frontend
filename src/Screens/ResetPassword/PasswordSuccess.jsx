import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundCross from '../../components/BackgroundCross/BackgroundCross';
import ButtonForm from '../../components/ButtonForm/ButtonForm';

const PasswordSuccess = () => {
    const navigate = useNavigate();
    return (
        <BackgroundCross variant="red" mirrored={true}>
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
                <h1 style={{
                    color: '#5a60a5',
                    fontFamily: 'Segoe UI',
                    fontWeight: 'bold',
                    margin: 0,
                    fontSize: '2.2rem',
                    textAlign: 'center'
                }}>
                    Tu contraseña ha sido actualizada con éxito
                </h1>
                <ButtonForm
                    text="Volver al inicio"
                    onClick={() => navigate('/')}
                />
            </div>
        </BackgroundCross>
    );
};

export default PasswordSuccess;