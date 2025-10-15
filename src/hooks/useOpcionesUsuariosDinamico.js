// useOpcionesUsuarioDinamicos({
//   data,
//   filterKeyMap: {
//     ROL: "usuario.rol_id",
//     USUARIO: "usuario",
//   },
//   setOpcionsRoles,
//   setOpcionsUsers
// });

import { useEffect, useState } from "react";
import { getOptions } from "../utils/selects";


export const useOpcionesUsuarioDinamicos = ({ 
    data,
    tipoUserKeyMap,
    setOpcionsRoles,
    setOpcionsUsers

}) => {

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    };

    // Guardar versiones previas para comparar
    const [prevRoles, setPrevRoles] = useState([]);
    const [prevUsers, setPrevUsers] = useState([]);

    useEffect(() => {
        if (!data || data.length === 0) return;
        //if (!data || !tipoUserKeyMap) return;

        getOptions(`${import.meta.env.VITE_API_URL}/api/roles`, item => ({
            value: item.id,
            label: item.nombre,

        })).then((opciones) => {
            const keyRol = tipoUserKeyMap["ROL"];
            const keyUsuario = tipoUserKeyMap["USUARIO"];

            // 1. Extrae los roles únicos que están en uso
            const rolIdEnUso = [
            ...new Set(data.map(doc => getNestedValue(doc, keyRol)).filter(Boolean))
            ];

            const rolesUsados = opciones.filter(rol =>
                rolIdEnUso.includes(rol.value)
            );
            setOpcionsRoles(rolesUsados);

            // 2. Construye un mapa de usuarios únicos
            const mapaUsuarios = new Map();

            data.forEach(doc => {
                const usuario = getNestedValue(doc, keyUsuario);
                if (!usuario || !usuario.id) return;

                if (!mapaUsuarios.has(usuario.id)) {
                    mapaUsuarios.set(usuario.id, {
                    value: usuario.id,
                    label: `${usuario.nombre} ${usuario.apellidos}`,
                    rol_id: usuario.rol_id,
                    });
                }
            });

            const opcionesUsuarios = Array.from(mapaUsuarios.values());
             const rolesChanged = JSON.stringify(rolesUsados) !== JSON.stringify(prevRoles);
            const usersChanged = JSON.stringify(opcionesUsuarios) !== JSON.stringify(prevUsers);

            if (rolesChanged) {
                setOpcionsRoles(rolesUsados);
                setPrevRoles(rolesUsados);
            }

            if (usersChanged) {
                setOpcionsUsers(opcionesUsuarios);
                setPrevUsers(opcionesUsuarios);
            }
        });
    }, [data, tipoUserKeyMap, prevRoles, prevUsers, setOpcionsRoles, setOpcionsUsers]);





}