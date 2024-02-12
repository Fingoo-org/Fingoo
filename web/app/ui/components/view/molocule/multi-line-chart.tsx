'use client';
import { EventProps, LineChart } from '@tremor/react';
import { useState } from 'react';

type MultiLineChartProps = {
  data: any[];
  categories: string[];
  noDataText?: string;
};

export default function MultiLineChart({ data, categories, noDataText }: MultiLineChartProps) {
  const [value, setValue] = useState<EventProps>(null);
  return (
    <>
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
        noDataText={noDataText}
      />
    </>
  );
}
