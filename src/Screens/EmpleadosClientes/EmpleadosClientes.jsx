import { useEffect, useState } from "react";
import styles from "./EmpleadosClientes.module.css";
import Empleados from "../Empleados/Empleados";
import Clientes from "../Clientes/Clientes";

const EmpleadosClientes = () => {
    // Guardar qué se seleccionó, empleados o clientes
    const storedPage = localStorage.getItem('paginaEmpleadosClientes');

    // Si no hay nada guardado se usa este valor
    const [empleadosPagina, setEmpleadosPagina] = useState(storedPage === 'clientes' ? false : true);
    const [clientesPagina, setClientesPagina] = useState(storedPage === 'clientes' ? true : false);
    
    const handleChangePage = () => {
        setEmpleadosPagina(!empleadosPagina);
        setClientesPagina(!clientesPagina);
        localStorage.setItem('paginaEmpleadosClientes', !empleadosPagina ? 'clientes' : 'empleados');
    }

    useEffect(() => {
        // Verificar si hay un valor guardado en localStorage al cargar la página
        const storedPage = localStorage.getItem('paginaEmpleadosClientes');
        if (storedPage) {
            if (storedPage === 'empleados') {
                setEmpleadosPagina(true);
                setClientesPagina(false);
            } else {
                setEmpleadosPagina(false);
                setClientesPagina(true);
            }
        }
    }, []);

    return(
        <main className={styles.pantallaEC}>
            <div className={styles.navbarEC}>
                <div className={styles.contenedorBotonesEC}>
                    <button 
                        className={`${styles.botonEmpleadoOCliente} ${empleadosPagina ? styles.botonECNoActivo : ''}`}
                        onClick={handleChangePage}
                    >
                        Empleados
                    </button>

                    <button 
                        className={`${styles.botonEmpleadoOCliente} ${clientesPagina ? styles.botonECNoActivo : ''}`}
                        onClick={handleChangePage}
                    >
                        Clientes
                    </button>
                </div>
            </div>

            <div className={styles.contenidoEC}>
                {empleadosPagina ? <Clientes/> : <Empleados/>}
            </div>
        </main>
    )
}

export default EmpleadosClientes;
