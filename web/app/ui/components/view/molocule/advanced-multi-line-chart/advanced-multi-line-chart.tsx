'use client';

import {
  ChartCanvas,
  Chart,
  LineSeries,
  discontinuousTimeScaleProviderBuilder,
  XAxis,
  YAxis,
  MouseCoordinateY,
  MouseCoordinateX,
  CrossHairCursor,
  CurrentCoordinate,
  SingleValueTooltip,
} from 'react-financial-charts';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { useResponsive } from '../../hooks/use-responsive';
import { FormattedIndicatorValue, FormattedRowType } from '@/app/business/services/chart/indicator-formatter.service';

const INDICATOR_COLORS = ['#a5b4fc', '#fecdd3', '#737373', '#6366f1', '#3b82f6'];

function IndicatorLineSeries({ indicatorKey, idx }: { indicatorKey: string; idx: number }) {
  return (
    <>
      <CurrentCoordinate
        fillStyle={INDICATOR_COLORS[idx]}
        strokeStyle={INDICATOR_COLORS[idx]}
        yAccessor={(d) => {
          if (d[indicatorKey] === undefined) return;

          return d[indicatorKey].value;
        }}
      />
      <LineSeries
        strokeStyle={INDICATOR_COLORS[idx]}
        yAccessor={(d) => {
          if (d[indicatorKey] === undefined) return;

          return d[indicatorKey].value;
        }}
      />

      <SingleValueTooltip
        yAccessor={(d) => {
          if (d[indicatorKey] === undefined) return;

          return d[indicatorKey].displayValue;
        }}
        yLabel={indicatorKey}
        yDisplayFormat={format('.2f')}
        valueFill={INDICATOR_COLORS[idx]}
        labelFill={INDICATOR_COLORS[idx]}
        origin={[8, 16 * (idx + 1)]}
      />
    </>
  );
}

type AdvancedMultiLineChartProps<T> = {
  data: FormattedRowType[];
  initialIndex: number;
  displayRowsSize?: number;
  onLoadData?: (rowsToDownload: number, initialIndex: number) => void;
};

export default function AdvancedMultiLineChart<T extends Record<string, any>>({
  data,
  initialIndex,
  displayRowsSize = 10,
  onLoadData,
}: AdvancedMultiLineChartProps<T>) {
  const { containerRef, sizes } = useResponsive();
  // fix: 애 위로 올려야함

  const indexCalculator = discontinuousTimeScaleProviderBuilder()
    .inputDateAccessor((d: T) => new Date(d.date))
    .initialIndex(initialIndex)
    .indexCalculator();
  const { index } = indexCalculator(data);

  const ScaleProvider = discontinuousTimeScaleProviderBuilder()
    .inputDateAccessor((d: T) => new Date(d.date))
    .withIndex(index);

  const { data: scaledData, xScale, xAccessor, displayXAccessor } = ScaleProvider(data);

  const endData = scaledData[scaledData.length - 1];
  const startData = scaledData[scaledData.length - displayRowsSize];
  const xExtents = [xAccessor(startData), xAccessor(endData)];

  const handleLoadBefore = (start: number, end: number) => {
    const rowsToDownload = end - Math.ceil(start);

    onLoadData?.(rowsToDownload, -Math.ceil(start));
  };

  const yExtents = (d: FormattedRowType) => {
    return Object.keys(d).reduce(
      (acc, key) => {
        if (key === 'date' || key === 'idx') return acc;
        return [...acc, (d[key] as FormattedIndicatorValue).value];
      },
      [0],
    );
  };

  const renderLienSeries = () => {
    let index = -1;
    // bug: key값이 없어서 오류가 발생함 index가 0일 때 key를 보장할 수 없기 때문
    return Object.keys(scaledData[0]).map((key) => {
      if (key !== 'date' && key !== 'idx') {
        index += 1;
        return <IndicatorLineSeries key={key} indicatorKey={key} idx={index} />;
      }
    });
  };

  if (data.length === 0) return null;

  return (
    <div data-testid="advanced-multi-line-chart" ref={containerRef} className="h-full w-full">
      <ChartCanvas
        xExtents={xExtents}
        xScale={xScale}
        data={scaledData}
        displayXAccessor={displayXAccessor}
        disableZoom={true}
        xAccessor={xAccessor}
        width={sizes.containerWidth}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        height={sizes.containerHeight}
        seriesName="data"
        ratio={1}
        onLoadBefore={handleLoadBefore}
      >
        <Chart id={1} height={sizes.containerHeight - 50} yExtents={yExtents}>
          <XAxis showTicks={false} showGridLines axisAt="bottom" orient="bottom" />
          <YAxis />
          {renderLienSeries()}
          <CrossHairCursor />
          <MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} />
          <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat('%Y-%m-%d')} />
        </Chart>
      </ChartCanvas>
    </div>
  );
}
