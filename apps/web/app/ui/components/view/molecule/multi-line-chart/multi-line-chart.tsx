'use client';
import { EventProps } from '@tremor/react';
import LineChart from './line-chart';
import { useState } from 'react';
import { ChartTooltip } from './chart-tooltip';
import { FormattedRowType } from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';
import { cn } from '@/app/utils/style';
import { formatChartData } from '@/app/utils/tremor/chart-data-formatter';
import { INDICATOR_COLOR } from '@/app/utils/style/color';

type MultiLineChartProps = {
  data: FormattedRowType[];
  categories: string[];
  syncId?: string;
  noDataText?: string;
  className?: string;
  height?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export default function MultiLineChart({
  data,
  categories,
  noDataText,
  syncId,
  className,
  height,
  ...props
}: MultiLineChartProps) {
  const [value, setValue] = useState<EventProps>(null);
  const index = 'date';

  const formatteedData = formatChartData(data, categories);
  return (
    <>
      <LineChart
        {...props}
        syncId={syncId}
        className={cn('h-full ', className)}
        data={formatteedData}
        index={index}
        categories={categories}
        height={height}
        // colors={['indigo-300', 'indigo-300', 'indigo-300', 'green-300', 'violet-400']}
        colors={INDICATOR_COLOR}
        yAxisWidth={60}
        onValueChange={(v) => setValue(v)}
        showAnimation={true}
        animationDuration={600}
        autoMinValue={true}
        enableLegendSlider={true}
        curveType={'linear'}
        noDataText={noDataText}
        customTooltip={ChartTooltip}
        tickGap={50}
      />
    </>
  );
}
