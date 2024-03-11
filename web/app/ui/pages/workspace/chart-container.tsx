'use client';
import { Card } from '@tremor/react';
import IndicatorsChart from '../../components/numerical-guidance/indicator/indicators-chart';
import IntervalToggleGroup from '../../components/numerical-guidance/indicator/interval-toggle-group';
import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../components/view/atom/client-data-suspense';

export default function ChartContainer() {
  return (
    <Card className="h-[29.5rem] w-[47.5rem] rounded-lg bg-white shadow-lg" decoration="top">
      <ClientDataSuspense fallback={<div>loading...</div>}>
        <SWRConfig value={{ suspense: true, keepPreviousData: true }}>
          <IndicatorsChart />
          <IntervalToggleGroup />
        </SWRConfig>
      </ClientDataSuspense>
    </Card>
  );
}
