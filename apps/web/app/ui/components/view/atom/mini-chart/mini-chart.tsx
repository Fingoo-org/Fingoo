import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export type ChartTimeline = { time: string; value: number };

interface ColoredLineChartProps {
  data: ChartTimeline[];
  color: string;
}

const ColoredLineChart = ({ data, color }: ColoredLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface MiniChartProps {
  data: ChartTimeline[];
  className?: string;
  isPositive: boolean;
}

const MiniChart = ({ data, className, isPositive }: MiniChartProps) => {
  if (!data || data.length === 0) {
    return <div className={className}>No data</div>;
  }

  const color = isPositive ? '#ef4444' : '#3b82f6';

  return (
    <div className={className}>
      <ColoredLineChart data={data} color={color} />
    </div>
  );
};

export default MiniChart;
