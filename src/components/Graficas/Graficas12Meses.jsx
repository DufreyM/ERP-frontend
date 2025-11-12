import ReactECharts from "echarts-for-react";

export default function VentasLineChart({
    data,
    
}) {

    
    
    const option = {
        title: {
        text: "Ventas mensuales",
        left: "center",
        },
        tooltip: { trigger: "axis" },
        xAxis: {
        type: "category",
        data: data.map((d) =>
            new Date(d.mes).toLocaleString("es-ES", { month: "short" })
        ),
        },
        yAxis: { type: "value", name: "Total ventas (Q)" },
        series: [
        {
            name: "Ventas",
            type: "line",
            data: data.map((d) => d.total_ventas),
            smooth: true,
            areaStyle: { color: "rgba(99, 102, 241, 0.2)" },
            lineStyle: { color: "#5a60a5", width: 3 },
            symbol: "circle",
            symbolSize: 8,
        },
        ],
    };

  return <ReactECharts option={option} style={{ height: 300 }} />;
}
