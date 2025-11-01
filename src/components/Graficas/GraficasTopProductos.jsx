import ReactECharts from "echarts-for-react";

export default function TopProductosChart({ 
    data,
   
 }) {

    

    const option = {
        title: { text: "Top productos más vendidos", left: "center" },
        tooltip: { trigger: "axis" },
        grid: { left: "20%", right: "5%", bottom: "10%" },
        xAxis: { type: "value", name: "Cantidad vendida" },
        yAxis: {
        type: "category",
        data: data.map((d) => d.nombre),
        },
        series: [
        {
            name: "Ventas",
            type: "bar",
            data: data.map((d) => d.total_vendida),
            itemStyle: { color: "#5a60a5" },
            label: {
            show: true,
            position: "right",
            formatter: "{c}", // muestra el número de ventas
            },
        },
        ],
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
}
