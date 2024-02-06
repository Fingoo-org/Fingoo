'use client';
import { Card } from '@tremor/react';
import IndicatorsChart from '../../components/numerical-guidance/indicators-chart';
import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../components/view/atom/client-data-suspense';

export default function ChartContainer() {
  return (
    <Card className="w-[47.5rem] h-[27.5rem] bg-white shadow-lg rounded-lg" decoration="top">
      <ClientDataSuspense fallback={<div>loading...</div>}>
        <SWRConfig value={{ suspense: true, keepPreviousData: true }}>
          <IndicatorsChart />
        </SWRConfig>
      </ClientDataSuspense>
    </Card>
  );
}
