
import { useState } from "react";
import styles from "./HistorialComprasVentas.module.css";
import Ventas from "../Ventas/Ventas";
import Compras from "../Compras/Compras";

const HistorialComprasVentas = () => {

    const [ventasPagina, setVentasPagina] = useState(true);
    const [comprasPagina, setComprasPagina] = useState(false);
    const hadleChangePage = () => {
        
        setVentasPagina(comprasPagina);
        setComprasPagina(ventasPagina)
    }

    return(
        <main className= {styles.pantallaCV}>
            <div className={styles.navbarCV}>
            
                <div className={styles.contenedorBotonesCV}>
                    
                        <button 
                            className={`${styles.botonCompraOVenta} ${ventasPagina? styles.botonCVNoActivo : ''}`}
                            onClick={hadleChangePage}
                        >
                            Compras
                        </button>

                        <button 
                            className={`${styles.botonCompraOVenta} ${comprasPagina? styles.botonCVNoActivo : ''}`}
                            onClick={hadleChangePage}
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