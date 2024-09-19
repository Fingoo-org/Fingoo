'use client';
import React from 'react';
import LineChart from '../../../view/molecule/multi-line-chart/line-chart';
import { cn } from '@/app/utils/style';
import { FormattedRowType } from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';

type DetailChartProps = {
  data: { date: string; value: number }[];
  category: string;
  noDataText?: string;
  height?: number;
  showHighLowPoints?: boolean;
  customColor?: string;
};

export default function DetailChart({
  data,
  category,
  noDataText = 'no data',
  height = 300,
  showHighLowPoints = true,
  customColor,
}: DetailChartProps) {
  const formattedData: FormattedRowType[] = data.map(({ date, value }) => ({
    date,
    [category]: value.toString(),
  }));

  const index = 'date';

  const getCustomColorClass = (color: string) => {
    return color;
  };

  return (
    <div className={cn('w-full')}>
      <LineChart
        data={formattedData}
        index={index}
        categories={[category]}
        height={height}
        showXAxis={false}
        yAxisWidth={60}
        noDataText={noDataText}
        curveType="linear"
        showAnimation={true}
        animationDuration={600}
        connectNulls={true}
        showHighLowPoints={true}
        customColors={customColor ? [getCustomColorClass(customColor)] : undefined}
        customReferenceLine={50}
        showLegend={false}
      />
    </div>
  );
}
