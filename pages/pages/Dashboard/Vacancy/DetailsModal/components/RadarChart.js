import React, { useEffect, useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Text } from 'recharts';


export default function MyRadarChart({data}) {

  console.log("graph",data)
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const CustomizedAxisTick = ({ x, y, payload, cx, cy }) => {
    const radius = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
    const labelOffset = radius * 0.06; // Adjust this value to fine-tune label position
    
    const labelX = cx + (x - cx) / radius * (radius + labelOffset);
    const labelY = cy + (y - cy) / radius * (radius + labelOffset);
  
    const textAnchor = labelX > cx ? 'start' : labelX < cx ? 'end' : 'middle';
    const verticalAnchor = labelY > cy ? 'start' : labelY < cy ? 'end' : 'middle';
  
    return (
      <Text
        x={labelX}
        y={labelY}
        textAnchor={textAnchor}
        verticalAnchor={verticalAnchor}
        fill="#666"
        fontSize={10}
      >
        {payload.value}
      </Text>
    );
  };

  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.chart-container');
      if (container) {
        const { width } = container.getBoundingClientRect();
        setChartSize({ width, height: Math.min(width, 400) });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return (
    <div className="w-full chart-container m-auto">
      {data && (
        <div style={{ width: chartSize.width, height: chartSize.height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="50%" data={data}>
              <Legend iconType='circle' verticalAlign="top" />
              <PolarGrid />
              <PolarAngleAxis
                dataKey="subject"
                tickLine={false}
                axisLine={false}
                tick={<CustomizedAxisTick />}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                ticks={[20, 40, 60, 80, 100]}
                tick={{ fill: '#666', fontSize: 10 }}
                axisLine={false}
                orientation='middle'
              />
              <Radar name="Candidate Talent Pool" dataKey="candidate" stroke="#317FD4" fill="#317FD4" fillOpacity={0.4} strokeWidth={2} />
              <Radar name="Benchmark" dataKey="average" stroke="#6B57F5" fill="#6B57F5" fillOpacity={0.4} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );

}