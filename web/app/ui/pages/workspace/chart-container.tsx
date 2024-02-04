'use client';
import { Card } from '@tremor/react';
import dynamic from 'next/dynamic';
// import IndicatorsChart from '../../components/numerical-guidance/indicators-chart';
import { SWRConfig } from 'swr';

const IndicatorsChart = dynamic(() => import('../../components/numerical-guidance/indicators-chart'), {
  ssr: false,
  loading: () => <div>loading...</div>,
});

export default function ChartContainer() {
  return (
    <Card className="w-[47.5rem] h-[27.5rem] bg-white shadow-lg rounded-lg" decoration="top">
      <SWRConfig value={{ suspense: true, keepPreviousData: true }}>
        <IndicatorsChart />
      </SWRConfig>
    </Card>
  );
}
