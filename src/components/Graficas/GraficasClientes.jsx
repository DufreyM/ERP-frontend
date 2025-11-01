import ReactECharts from "echarts-for-react";

export default function TopClientesChart({ 
    data,

 }) {

   
    const option = {
        title: { text: "Top clientes por monto comprado", left: "center" },
        tooltip: { trigger: "axis" },
        grid: { left: "25%", right: "5%", bottom: "10%" },
        xAxis: { type: "value", name: "Monto ($)" },
        yAxis: {
        type: "category",
        data: data.map((d) => d.nombre),
        },
        series: [
        {
            name: "Total comprado",
            type: "bar",
            data: data.map((d) => d.total_comprado),
            itemStyle: { color: "#2196f3" },
            label: {
            show: true,
            position: "right",
            formatter: "${c}",
            },
        },
        ],
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
}
