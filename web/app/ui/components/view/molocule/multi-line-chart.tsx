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
        className="mt-4 h-72"
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
