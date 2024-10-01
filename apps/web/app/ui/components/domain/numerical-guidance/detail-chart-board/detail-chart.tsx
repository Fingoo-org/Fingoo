'use client';
import React from 'react';
import LineChart from '../../../view/molecule/multi-line-chart/line-chart';
import { cn } from '@/app/utils/style';
import { useDetailChart } from '@/app/business/hooks/numerical-guidance/detail-chart-board/use-detail-chart.hook';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { FormattedRowType } from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';
import { useIndicatorQuote } from '@/app/business/hooks/numerical-guidance/indicator/use-indicator-quote-view-model.hooks';
import { useDetailBoard } from '@/app/business/hooks/numerical-guidance/detail-chart-board/use-detail-board.hook';
import Pending from '../../../view/molecule/pending';

type DetailChartProps = {
  indicatorId: string;
  symbol: string;
  indicatorType: IndicatorType;
  noDataText?: string;
  showHighLowPoints?: boolean;
};

export default function DetailChart({
  indicatorId,
  symbol,
  indicatorType,
  noDataText = 'no data',
  showHighLowPoints = true,
}: DetailChartProps) {
  const startDate = new Date().toISOString().split('T')[0];
  const { interval } = useDetailBoard();

  const {
    detailChart,
    isLoading: isChartLoading,
    isError: isChartError,
  } = useDetailChart({
    indicatorId,
    interval,
    indicatorType,
    startDate,
  });

  const { formattedIndicatorQuote: indicatorQuoteData, isPending: isQuoteLoading } = useIndicatorQuote({
    indicatorId,
    symbol,
    indicatorType,
  });

  const customColor = indicatorQuoteData && Number(indicatorQuoteData.change) < 0 ? 'blue-500' : 'red-500';
  const previousCloseNumber = indicatorQuoteData?.previousClose
    ? parseFloat(indicatorQuoteData.previousClose)
    : undefined;

  const chartData: FormattedRowType[] =
    detailChart?.values.map(({ date, value }) => ({
      date,
      [detailChart.symbol]: value.toString(),
    })) || [];

  const isLoading = isChartLoading || isQuoteLoading;

  return (
    <Pending isPending={isLoading}>
      {isChartError ? (
        <div>Error loading chart data</div>
      ) : (
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
            customColors={[customColor]}
            customReferenceLine={previousCloseNumber}
            showLegend={false}
          />
        </div>
      )}
    </Pending>
  );
}
