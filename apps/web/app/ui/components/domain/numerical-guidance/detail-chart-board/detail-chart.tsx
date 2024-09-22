'use client';
import React from 'react';
import LineChart from '../../../view/molecule/multi-line-chart/line-chart';
import { cn } from '@/app/utils/style';
import { useDetailChart } from '@/app/business/hooks/numerical-guidance/detail-chart-board/use-detail-chart.hook';
import { Interval } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { FormattedRowType } from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';
import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';

type DetailChartProps = {
  indicatorId: string;
  startDate: string;
  indicatorType: IndicatorType;
  noDataText?: string;
  showHighLowPoints?: boolean;
  customColor?: string;
};

export default function DetailChart({
  indicatorId,
  startDate,
  indicatorType,
  noDataText = 'no data',
  showHighLowPoints = true,
  customColor,
}: DetailChartProps) {
  const { interval } = useIndicatorBoard(indicatorId);
  const { detailChart, isLoading, isError } = useDetailChart({
    indicatorId,
    interval,
    indicatorType,
    startDate,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading chart data</div>;

  const chartData: FormattedRowType[] =
    detailChart?.values.map(({ date, value }) => ({
      date,
      [detailChart.symbol]: value.toString(),
    })) || [];

  const getCustomColorClass = (color: string) => {
    return color;
  };

  return (
    <div className={cn('w-full')}>
      <LineChart
        data={chartData}
        index="date"
        categories={[detailChart?.symbol || '']}
        height={300}
        showXAxis={false}
        yAxisWidth={60}
        noDataText={noDataText}
        curveType="linear"
        showAnimation={true}
        animationDuration={600}
        connectNulls={true}
        showHighLowPoints={showHighLowPoints}
        customColors={customColor ? [getCustomColorClass(customColor)] : undefined}
        customReferenceLine={50}
        showLegend={false}
      />
    </div>
  );
}
