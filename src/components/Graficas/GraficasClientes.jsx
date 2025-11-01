import ReactECharts from "echarts-for-react";

export default function TopClientesChart({ 
    data,

 }) {

    const clientes = data.map((d) => ({
        ...d,
        nombre:
        !d.nombre ||
        d.nombre.trim().toLowerCase() === "desconocido" ||
        d.cliente_id === null
            ? "Consumidor final"
            : d.nombre,
    }));

   
    const option = {
        title: { text: "Top clientes por monto comprado", left: "center" },
        tooltip: { trigger: "axis" },
        grid: { left: "25%", right: "5%", bottom: "10%" },
        xAxis: { type: "value", name: "Monto (Q)" },
        yAxis: {
        type: "category",
        data: clientes.map((d) => d.nombre),
        },
        series: [
        {
            name: "Total comprado",
            type: "bar",
            data: data.map((d) => d.total_comprado),
            itemStyle: { color: "#5a60a5" },
            label: {
            show: true,
            position: "right",
            formatter: "Q{c}",
            },
        },
        ],
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
}
