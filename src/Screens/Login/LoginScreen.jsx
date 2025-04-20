import React, { useState } from 'react';

const LoginScreen = () => {
    const [username, setUsername] = useState('');

    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };

    return (
        <div style={{ padding: '20px' }}>
            <input
                type="text"
                id="username"
                value={username}
                onChange={handleInputChange}
                placeholder="Nombre de usuario"
                style={{
                    padding: '8px',
                    width: '100%',
                    maxWidth: '300px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            />
        </div>
    );
};

export default LoginScreen;