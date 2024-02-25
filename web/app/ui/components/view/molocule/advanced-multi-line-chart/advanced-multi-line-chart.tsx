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

type AdvancedMultiLineChartProps<T> = {
  data: T[];
};

export default function AdvancedMultiLineChart<T extends Record<string, any>>({
  data,
}: AdvancedMultiLineChartProps<T>) {
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

  const max = xAccessor(scaledData[scaledData.length - 1]);
  const min = xAccessor(scaledData[Math.max(0, scaledData.length - 100)]);
  const xExtents = [min, max + 5];

  return (
    <ChartCanvas
      xExtents={xExtents}
      xScale={xScale}
      data={scaledData}
      displayXAccessor={displayXAccessor}
      xAccessor={xAccessor}
      width={600}
      height={300}
      seriesName="data"
      ratio={3}
    >
      <Chart id={1} height={100} yExtents={yExtents}>
        <XAxis showTicks={false} showGridLines axisAt="bottom" orient="bottom" />
        <YAxis />
        <LineSeries yAccessor={(d) => d.AAPL} />
        <LineSeries yAccessor={(d) => d.GOOG} />
        <LineSeries yAccessor={(d) => d.MSFT} />
        <MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} />
        <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat('%Y-%m-%d')} />
      </Chart>
    </ChartCanvas>
  );
}
