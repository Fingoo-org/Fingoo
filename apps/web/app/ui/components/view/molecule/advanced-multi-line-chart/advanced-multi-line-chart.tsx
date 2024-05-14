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
import {
  FormattedIndicatorValue,
  FormattedRowType,
  chartValueFormatterFactory,
} from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';

const INDICATOR_COLORS = ['#a5b4fc', '#fecdd3', '#737373', '#6366f1', '#3b82f6'];

function IndicatorLineSeries({
  indicatorKey,
  idx,
  valueFormmater,
}: {
  indicatorKey: string;
  idx: number;
  valueFormmater: (data: FormattedIndicatorValue) => number;
}) {
  return (
    <>
      <CurrentCoordinate
        fillStyle={INDICATOR_COLORS[idx]}
        strokeStyle={INDICATOR_COLORS[idx]}
        yAccessor={(d) => {
          if (!d[indicatorKey]) return 0;

          return valueFormmater(d[indicatorKey]);
        }}
      />
      <LineSeries
        strokeStyle={INDICATOR_COLORS[idx]}
        yAccessor={(d) => {
          if (!d[indicatorKey]) return;

          return valueFormmater(d[indicatorKey]);
        }}
      />

      <SingleValueTooltip
        yAccessor={(d) => {
          if (!d[indicatorKey]) return 0;

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
  categoriesList?: string[][];
  onLoadData?: (rowsToDownload: number, initialIndex: number) => void;
};

export default function AdvancedMultiLineChart<T extends Record<string, any>>({
  data,
  initialIndex,
  displayRowsSize = 10,
  categoriesList,
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

  const createYExtents =
    (categories: string[], valueFormmater: (data: FormattedIndicatorValue) => number) => (d: FormattedRowType) => {
      return Object.keys(d).reduce(
        (acc, key) => {
          if (categories.includes(key)) {
            return [...acc, valueFormmater(d[key] as FormattedIndicatorValue)];
          }
          return acc;
        },
        [0],
      );
    };

  const renderLienSeries = (categories: string[], valueFormmater: (data: FormattedIndicatorValue) => number) => {
    let index = -1;
    return categories.map((key, _) => {
      index += 1;
      return <IndicatorLineSeries valueFormmater={valueFormmater} key={key} indicatorKey={key} idx={index} />;
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
        height={categoriesList ? categoriesList.length * 350 : 350}
        seriesName="data"
        ratio={1}
        onLoadBefore={handleLoadBefore}
      >
        {categoriesList
          ? categoriesList.map((categories, index) => {
              const valueFormatter = chartValueFormatterFactory(categories);
              return (
                <Chart
                  origin={(w, h) => [0, 350 * index]}
                  key={index}
                  id={index}
                  height={300}
                  yExtents={createYExtents(categories, valueFormatter)}
                >
                  <XAxis showTicks={false} showGridLines axisAt="bottom" orient="bottom" />
                  <YAxis />
                  {renderLienSeries(categories, valueFormatter)}
                  <CrossHairCursor />
                  <MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} />
                  <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat('%Y-%m-%d')} />
                </Chart>
              );
            })
          : null}
      </ChartCanvas>
    </div>
  );
}
