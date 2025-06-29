import { DualAxes } from "@ant-design/plots";

export const DemoDualAxes = ({ data, range }) => {
  const config = {
    xField: "time",
    scale: {
      color: {
        range,
      },
    },
    height: 180,
    children: [
      {
        data: data,
        type: "line",
        yField: "value",
        colorField: "type",
        shapeField: "smooth",
        style: { lineWidth: 3 },
      },
    ],
  };
  return <DualAxes {...config} />;
};
