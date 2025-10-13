/**
 * Obtiene opciones para un select desde una API
 * @param {string} url - La URL del backend
 * @param {function} mapFn - Función que recibe cada ítem y retorna { value, label }
 * @returns {Promise<Array<{ value: any, label: string }>>}
 */


export async function getOptions(url, mapFn) {

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Errror Http: ${res.status}`);
        const data = await res.json();
        return data.map(mapFn);

    } catch (err) {
        console.error("Error al obtener opciones: ", err);
        return [];
    }
    
}

export async function getOptionsToken(url, mapFn, token) {
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        
        const data = await res.json();
        return data.map(mapFn);

    } catch (err) {
        console.error("Error al obtener opciones: ", err);
        return [];
    }
}
