import ReactECharts from "echarts-for-react";

export default function MetaSemanalGauge({ data, text }) {
  const cumplimiento = parseFloat(data.cumplimiento);
  const ventas = data.ventas || 0;
  const meta = data.meta || 0;

  const option = {
    title: {
      text: text,
      left: "center",
    },
    series: [
      {
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        progress: {
          show: true,
          width: 20,
          roundCap: true,
          itemStyle: {
            color:
              cumplimiento >= 100
                ? "#38a543ff" // verde si cumple o supera la meta
                : "#5355c0ff", // azul si va en progreso
          },
        },
        axisLine: {
          lineStyle: {
            width: 20,
            color: [[1, "#E5E7EB"]], // fondo gris claro
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, "0%"],
          formatter: () =>
            `{a|${cumplimiento.toFixed(1)}%}\n{b|Ventas: Q${ventas.toLocaleString()}}\n{c|Meta: Q${meta.toLocaleString()}}`,
          rich: {
            a: {
              fontSize: 36,
              fontWeight: "bold",
              color:
                cumplimiento >= 100
                  ? "#10B981"
                  : "#6366F1",
            },
            b: {
              fontSize: 18,
              color: "#374151",
              padding: [8, 0, 0, 0],
            },
            c: {
              fontSize: 16,
              color: "#6B7280",
              padding: [4, 0, 0, 0],
            },
          },
        },
        data: [{ value: cumplimiento }],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
}
