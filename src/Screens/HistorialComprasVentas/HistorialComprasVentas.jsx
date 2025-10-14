
import { useEffect, useState } from "react";
import styles from "./HistorialComprasVentas.module.css";
import Ventas from "../Ventas/Ventas";
import Compras from "../Compras/Compras";

const HistorialComprasVentas = () => {

    //guardar que se seleccionó, compras o ventas
    const storedPage = localStorage.getItem('paginaSeleccionada');

    //si no hay nada guardado se usa este valor
    const [ventasPagina, setVentasPagina] = useState(storedPage === 'ventas');
    const [comprasPagina, setComprasPagina] = useState(storedPage === 'compras');
    const handleChangePage = () => {
        
        setVentasPagina(!ventasPagina);
        setComprasPagina(!comprasPagina);

        localStorage.setItem('paginaSeleccionada', !ventasPagina ? 'ventas' : 'compras')
    }

    useEffect(() => {
        // Verificar si hay un valor guardado en localStorage al cargar la página
        const storedPage = localStorage.getItem('paginaSeleccionada');
        if (storedPage) {
            if (storedPage === 'ventas') {
                setVentasPagina(true);
                setComprasPagina(false);
            } else {
                setVentasPagina(false);
                setComprasPagina(true);
            }
        }
    }, []);


    return(
        <main className= {styles.pantallaCV}>
            <div className={styles.navbarCV}>
            
                <div className={styles.contenedorBotonesCV}>
                    
                        <button 
                            className={`${styles.botonCompraOVenta} ${ventasPagina ? styles.botonCVNoActivo : ''}`}
                            onClick={handleChangePage}
                        >
                            Compras
                        </button>

                        <button 
                            className={`${styles.botonCompraOVenta} ${comprasPagina ? styles.botonCVNoActivo : ''}`}
                            onClick={handleChangePage}
                        >
                            Ventas
                        </button>
                    
                </div>

            </div>

            <div className={styles.contenidoCV}>
                {ventasPagina ? <Ventas></Ventas> :<Compras></Compras>}
            </div>
            
        </main>
    )
}

export default HistorialComprasVentas;