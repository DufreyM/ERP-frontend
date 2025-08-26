// useOpcionesUsuarioDinamicos({
//   data,
//   filterKeyMap: {
//     ROL: "usuario.rol_id",
//     USUARIO: "usuario",
//   },
//   setOpcionsRoles,
//   setOpcionsUsers
// });

import { useEffect } from "react";
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

    useEffect(() => {
        if (!data) return;
        //if (!data || !tipoUserKeyMap) return;

        getOptions("http://localhost:3000/api/roles", item => ({
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
            setOpcionsUsers(opcionesUsuarios);
        });
        }, [data]);





}