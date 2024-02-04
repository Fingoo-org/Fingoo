'use client';
import { useIndicatorsValueViewModel } from '@/app/hooks/use-indicators-value-view-model.hook';
import MultiLineChart from '../view/molocule/multi-line-chart';
import { useMemo } from 'react';
import Pending from '../view/molocule/pending';

export default function IndicatorsChart() {
  const { indciatorsValueViewModel, isPending } = useIndicatorsValueViewModel();

  const formattedIndicatorsRows = useMemo(
    () => indciatorsValueViewModel?.formattedIndicatorsInRow,
    [indciatorsValueViewModel],
  );

  const category = indciatorsValueViewModel?.tickerList ? indciatorsValueViewModel.tickerList : [];

  return (
    <>
      <Pending isPending={isPending}>
        <MultiLineChart data={formattedIndicatorsRows || []} categories={category} />
      </Pending>
    </>
  );
}
