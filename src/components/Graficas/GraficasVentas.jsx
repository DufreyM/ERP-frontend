import ReactECharts from 'echarts-for-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faTrash, faPen, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import styles from "./Graficas.module.css"
import VentasComprasChart from './GraficasComprasVentas';
import VentasLineChart from './Graficas12Meses';
import TopClientesChart from './GraficasClientes';
import TopProductosChart from './GraficasTopProductos';
import MetaSemanalGauge from './GraficaMetaSemanal';

const BaseGraficas = ({
    data,
    loading,
    error,
    nameGrafic,
    titulo
}) => {

  
    return(
        <div className={styles.baseGraficas}>
            


            {/* ⏳ Estado de carga */}
            {loading && (
                <div className={styles.placeholder}>
                <p className={styles.loading}>⏳ Cargando {nameGrafic}...</p>
                {/* Aquí puedes reemplazar el texto por un spinner o una animación */}
                </div>
            )}

            {/* ❌ Error al cargar */}
            {!loading && error && (
                
                <div className={styles.emptyRowContent}>
                        <span className={styles.IconError}>
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                        </span>
                        <p>Error: {error}</p>
                    </div>
                
                
            )}

            {/* 📭 Sin datos */}
            {!loading && !error && (
                <>
                {(!data ||
                    (Array.isArray(data) && data.length === 0) ||
                    (typeof data === "object" &&
                    !Array.isArray(data) &&
                    Object.values(data).every(
                        (arr) => Array.isArray(arr) && arr.length === 0
                    ))) ? (
                   
                    <div className={styles.emptyRowContent}>
                        <span className={styles.IconError}>
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                        </span>
                        No hay datos disponibles por el momento
                    </div>
                   
                ) : (
                    // ✅ Datos disponibles → mostrar gráficas
                    <>
                        <p  className={styles.tituloGraficas}>{titulo}</p>

                        <div className={styles.contenedorGraficas}>

                            {nameGrafic === "ventas-compras" && (
                                <VentasComprasChart data={data} />
                            )}

                            {nameGrafic === "ventas-12-meses" && (
                                <VentasLineChart data={data} />
                            )}

                            {nameGrafic === "top-productos" && (
                                <TopProductosChart data={data} />
                            )}

                            {nameGrafic === "top-clientes" && (
                                <TopClientesChart data={data} />
                            )}

                            {nameGrafic === "meta-semanal" && (
                                <MetaSemanalGauge data={data} 
                                    text={"Meta de ventas semanal"}
                                />
                            )}

                            {nameGrafic === "meta-mensual" && (
                                <MetaSemanalGauge data={data} 
                                    text={"Meta de ventas mensual"}
                                />
                            )}
                        </div>

                    {/* Aquí puedes agregar más tipos si tienes más gráficas */}
                    </>
                )}
                </>
            )}

        </div>
    )
}
export default BaseGraficas;

