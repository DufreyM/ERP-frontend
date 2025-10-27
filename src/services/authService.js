// services/authService.js
export async function login(email, password) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contrasena: password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error en el inicio de sesión");
  }

  return await response.json(); // <-- esto debe incluir el token
}

export function getToken() {
  return localStorage.getItem("jwtToken");
}

export function storeToken(token) {
  localStorage.setItem("jwtToken", token);
}

export function removeToken() {
  localStorage.removeItem("jwtToken");
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