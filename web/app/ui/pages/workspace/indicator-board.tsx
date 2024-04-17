'use client';
import { Card } from '@tremor/react';
import IndicatorsChart from '../../components/numerical-guidance/indicator/indicators-chart';
import IntervalToggleGroup from '../../components/numerical-guidance/indicator/interval-toggle-group';
import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../components/util/client-data-suspense';
import CustomForecastIndicatorStabilityCallout from '../../components/numerical-guidance/custom-forecast-indicator/custom-forecast-indicator-stability-callout';

export default function IndicatorBoard() {
  return (
    <Card className="min-h-[32.5rem] w-[55rem] rounded-lg bg-white shadow-lg">
      <ClientDataSuspense fallback={<div>loading...</div>}>
        <SWRConfig value={{ suspense: true, keepPreviousData: true }}>
          <IndicatorsChart />
          <div className="py-6">
            <IntervalToggleGroup />
          </div>
          <CustomForecastIndicatorStabilityCallout />
        </SWRConfig>
      </ClientDataSuspense>
    </Card>
  );
}
