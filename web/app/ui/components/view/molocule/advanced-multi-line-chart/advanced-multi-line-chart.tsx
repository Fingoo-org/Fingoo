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

const INDICATOR_COLORS = ['#a5b4fc', '#fecdd3', '#737373', '#6366f1', '#3b82f6'];

const calculateDate = (date: Date, rowsToDownload: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - rowsToDownload);
  return newDate;
};

function IndicatorLineSeries({ indicatorKey, idx }: { indicatorKey: string; idx: number }) {
  return (
    <>
      <CurrentCoordinate
        fillStyle={INDICATOR_COLORS[idx]}
        strokeStyle={INDICATOR_COLORS[idx]}
        yAccessor={(d) => d[indicatorKey]}
      />
      <LineSeries strokeStyle={INDICATOR_COLORS[idx]} yAccessor={(d) => d[indicatorKey]} />
      ;
      <SingleValueTooltip
        yAccessor={(d) => d[indicatorKey]}
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
  data: T[];
  onLoadData?: (startDate: Date) => void;
};

export default function AdvancedMultiLineChart<T extends Record<string, any>>({
  data,
  onLoadData,
}: AdvancedMultiLineChartProps<T>) {
  const { containerRef, sizes } = useResponsive();

  const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: T) => new Date(d.date));

  const { data: scaledData, xScale, xAccessor, displayXAccessor } = ScaleProvider(data);

  const endData = scaledData[scaledData.length - 1];
  const startData = scaledData[0];
  const xExtents = [xAccessor(startData), xAccessor(endData)];

  const handleLoadBefore = (start: number, end: number) => {
    const rowsToDownload = end - Math.ceil(start);

    const newStartDate = calculateDate(startData.date, rowsToDownload);

    onLoadData?.(newStartDate);
  };

  const yExtents = (d: T) => {
    return Object.keys(d).reduce(
      (acc, key) => {
        if (typeof d[key] !== 'number') return acc;
        return [...acc, d[key]];
      },
      [0],
    );
  };

  const renderLienSeries = () => {
    return Object.keys(scaledData[0]).map((key, idx) => {
      if (typeof scaledData[0][key] === 'number') {
        return <IndicatorLineSeries key={key} indicatorKey={key} idx={idx} />;
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
