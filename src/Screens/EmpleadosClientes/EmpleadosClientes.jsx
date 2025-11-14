import { useEffect, useState } from "react";
import styles from "./EmpleadosClientes.module.css";
import Empleados from "../Empleados/Empleados";
import Clientes from "../Clientes/Clientes";

const EmpleadosClientes = () => {
    // Guardar qué se seleccionó, empleados o clientes
    const storedPage = localStorage.getItem('paginaEmpleadosClientes');
    
    // Si no hay nada guardado, por defecto muestra Empleados
    const [paginaActiva, setPaginaActiva] = useState(storedPage || 'empleados');
    
    const handleChangePage = () => {
        const nuevaPagina = paginaActiva === 'empleados' ? 'clientes' : 'empleados';
        setPaginaActiva(nuevaPagina);
        localStorage.setItem('paginaEmpleadosClientes', nuevaPagina);
    }

    useEffect(() => {
        // Verificar si hay un valor guardado en localStorage al cargar la página
        const storedPage = localStorage.getItem('paginaEmpleadosClientes');
        if (storedPage) {
            setPaginaActiva(storedPage);
        }
    }, []);

    return(
        <main className={styles.pantallaEC}>
            <div className={styles.navbarEC}>
                <div className={styles.contenedorBotonesEC}>
                    <button 
                        className={`${styles.botonEmpleadoOCliente} ${paginaActiva === 'empleados' ? '' : styles.botonECNoActivo}`}
                        onClick={handleChangePage}
                    >
                        Empleados
                    </button>

                    <button 
                        className={`${styles.botonEmpleadoOCliente} ${paginaActiva === 'clientes' ? '' : styles.botonECNoActivo}`}
                        onClick={handleChangePage}
                    >
                        Clientes
                    </button>
                </div>
            </div>

            <div className={styles.contenidoEC}>
                {paginaActiva === 'empleados' ? <Empleados/> : <Clientes/>}
            </div>
        </main>
    )
}

export default EmpleadosClientes;
