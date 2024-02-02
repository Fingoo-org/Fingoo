'use client';
import { useIndicatorsValueViewModel } from '@/app/hooks/use-indicators-value-view-model.hook';
import MultiLineChart from '../view/molocule/multi-line-chart';

export default function IndicatorsChart() {
  const { indciatorsValueViewModel, formattedIndicatorsRows } = useIndicatorsValueViewModel();

  const category = indciatorsValueViewModel?.tickerList ? indciatorsValueViewModel.tickerList : [];

  return (
    <>
      <MultiLineChart data={formattedIndicatorsRows || []} categories={category} />
    </>
  );
}
