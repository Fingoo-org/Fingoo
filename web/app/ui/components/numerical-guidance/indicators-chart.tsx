'use client';
import { useIndicatorsValueViewModel } from '@/app/hooks/use-indicators-value-view-model.hook';
import MultiLineChart from '../view/molocule/multi-line-chart';
import { useMemo } from 'react';

export default function IndicatorsChart() {
  const { indciatorsValueViewModel } = useIndicatorsValueViewModel();

  const formattedIndicatorsRows = useMemo(
    () => indciatorsValueViewModel?.formattedIndicatorsInRow,
    [indciatorsValueViewModel],
  );

  const category = indciatorsValueViewModel?.tickerList ? indciatorsValueViewModel.tickerList : [];

  return (
    <>
      <MultiLineChart data={formattedIndicatorsRows || []} categories={category} />
    </>
  );
}
