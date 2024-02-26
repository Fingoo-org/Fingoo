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
} from 'react-financial-charts';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { useResponsive } from './use-responsive';

type AdvancedMultiLineChartProps<T> = {
  data: T[];
};

const colors = ['#a5b4fc', '#fecdd3', '#737373', '#6366f1', '#3b82f6'];

export default function AdvancedMultiLineChart<T extends Record<string, any>>({
  data,
}: AdvancedMultiLineChartProps<T>) {
  const { containerRef, sizes } = useResponsive();

  const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: T) => new Date(d.date));

  const { data: scaledData, xScale, xAccessor, displayXAccessor } = ScaleProvider(data);

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
        return <LineSeries key={key} strokeStyle={colors[idx]} yAccessor={(d) => d[key]} />;
      }
    });
  };

  const max = xAccessor(scaledData[scaledData.length - 1]);
  const min = xAccessor(scaledData[Math.max(0, scaledData.length - 100)]);
  const xExtents = [min, max + 5];

  return (
    <div ref={containerRef} className="h-full w-full">
      <ChartCanvas
        // xExtents={xExtents}
        xScale={xScale}
        data={scaledData}
        displayXAccessor={displayXAccessor}
        xAccessor={xAccessor}
        width={sizes.containerWidth}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        height={sizes.containerHeight}
        seriesName="data"
        ratio={1}
      >
        <Chart id={1} height={sizes.containerHeight - 50} yExtents={yExtents}>
          <XAxis showTicks={false} showGridLines axisAt="bottom" orient="bottom" />
          <YAxis />
          {renderLienSeries()}
          <MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} />
          <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat('%Y-%m-%d')} />
        </Chart>
      </ChartCanvas>
    </div>
  );
}
