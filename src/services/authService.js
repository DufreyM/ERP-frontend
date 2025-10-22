export async function login(email, password) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, contrasena: password }) 
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la solicitud de inicio de sesión');
    }

    return await response.json();
}

export function getToken() {
    return localStorage.getItem('jwtToken');
}

export function removeToken() {
    localStorage.removeItem('jwtToken');
}



// //LOGICA de token vencido
// export function isTokenExpired(token) {
//     if (!token) return true;

//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = JSON.parse(atob(base64));
//         const { exp } = jsonPayload;

//         // Comparar fecha actual con expiración del token
//         return exp * 1000 < Date.now();
//     } catch (error) {
//         console.error('Error al decodificar el token:', error);
//         return true; // Por seguridad, asumimos que está expirado si falla
//     }
// }




// export function isAuthenticated() {
//     const token = getToken();
//     return token && !isTokenExpired(token);
// }


export function storeToken(token) {
    localStorage.setItem('jwtToken', token);
}


export async function fetchProtectedData() {
    const token = getToken();
    
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/protected`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch protected data');
    }

    return await response.json();
}

export async function changePassword(currentPassword, newPassword) {
    const token = getToken();
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!response.ok) {
        let message = 'Error al cambiar la contraseña';
        try {
            const data = await response.json();
            message = data?.error || data?.message || message;
        } catch (_) {}
        throw new Error(message);
    }

    return await response.json();
}