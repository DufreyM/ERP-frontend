const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function login(email, contrasena) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, contrasena })
    });

    if (!response.ok) {
        throw new Error('Error en la solicitud de inicio de sesión');
    }

    const data = await response.json();
    return data;
}