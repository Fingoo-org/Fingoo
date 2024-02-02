'use client';
import { useIndicatorsValueViewModel } from '@/app/hooks/use-indicators-value-view-model.hook';
import MultiLineChart from '../view/molocule/multi-line-chart';

export default function IndicatorsChart() {
  const { formattedIndicatorsRows } = useIndicatorsValueViewModel();
  console.log(formattedIndicatorsRows);

  return (
    <>
      <MultiLineChart />
    </>
  );
}
