'use client';
import { EventProps, LineChart, Title } from '@tremor/react';
import { useState } from 'react';

type MultiLineChartProps = {
  data: any[];
  categories: string[];
};

export default function MultiLineChart({ data, categories }: MultiLineChartProps) {
  const [value, setValue] = useState<EventProps>(null);
  return (
    <>
      <Title>Metadata Name</Title>
      <LineChart
        className="h-72 mt-4"
        data={data}
        index="date"
        categories={categories}
        colors={['indigo-300', 'rose-200', 'neutral', 'indigo', 'blue']}
        yAxisWidth={30}
        onValueChange={(v) => setValue(v)}
        showAnimation={true}
        animationDuration={600}
      />
    </>
  );
}
