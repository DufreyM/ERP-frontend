import ReactECharts from "echarts-for-react";

export default function VentasComprasChart({ 
    data,
    
}) {


    // ✅ Aseguramos que data exista y tenga las propiedades esperadas
    const compras = data?.compras || [];
    const ventas = data?.ventas || [];

    if (compras.length === 0 && ventas.length === 0)
        return <p>No hay datos disponibles para mostrar 📊</p>;

    // ✅ Extraemos los meses presentes en ambas series
    const meses = [
        ...new Set([
            ...compras.map((d) => new Date(d.mes).toISOString().slice(0, 7)),
            ...ventas.map((d) => new Date(d.mes).toISOString().slice(0, 7)),
        ]),
    ].sort();

    // ✅ Mapeamos datos por mes (aunque solo tengas 1 cada uno)
    const comprasData = meses.map(
        (m) =>
            parseFloat(
                compras.find((d) => d.mes.startsWith(m))?.total_compras || 0
            )
    );

    const ventasData = meses.map(
        (m) =>
            parseFloat(
                ventas.find((d) => d.mes.startsWith(m))?.total_ventas || 0
            )
    );

    const option = {
        title: { text: "Ventas vs Compras mensuales", left: "center" },
        tooltip: { trigger: "axis" },
        legend: { data: ["Ventas", "Compras"], top: "bottom" },
        xAxis: {
            type: "category",
            data: meses.map((m) =>
                new Date(m + "-01").toLocaleString("es-ES", { month: "short" })
            ),
        },
        yAxis: { type: "value", name: "Monto ($)" },
        series: [
            {
                name: "Ventas",
                type: "line",
                smooth: true,
                data: ventasData,
                itemStyle: { color: "#4CAF50" },
                areaStyle: { color: "rgba(76, 175, 80, 0.15)" },
            },
            {
                name: "Compras",
                type: "line",
                smooth: true,
                data: comprasData,
                itemStyle: { color: "#FF9800" },
                areaStyle: { color: "rgba(255, 152, 0, 0.15)" },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
}
