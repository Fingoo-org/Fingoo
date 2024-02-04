'use client';
import { Card } from '@tremor/react';
import IndicatorsChart from '../../components/numerical-guidance/indicators-chart';
import { Suspense } from 'react';
import { SWRConfig } from 'swr';
export default function ChartContainer() {
  return (
    <Card className="w-[47.5rem] h-[27.5rem] bg-white shadow-lg rounded-lg" decoration="top">
      <Suspense fallback={<div>Loading...</div>}>
        <SWRConfig value={{ suspense: true, keepPreviousData: true }}>
          <IndicatorsChart />
        </SWRConfig>
      </Suspense>
    </Card>
  );
}
