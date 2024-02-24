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
import { indicatorsValueMockData } from '@/app/mocks/mock-data/indicators-value.mock';
import { convertIndicatorsValueViewModel } from '@/app/business/services/view-model/indicators-value-view-model.service';
import { timeParse, timeFormat } from 'd3-time-format';
import { format } from 'd3-format';

type AdvancedMultiLineChartProps<T> = {
  data: T[];
};

const parseDate = timeParse('%Y-%m-%d');

export default function AdvancedMultiLineChart<T extends Record<string, any>>() {
  const data = {
    indicatorsValue: indicatorsValueMockData,
  };

  const convertedData = convertIndicatorsValueViewModel(data).formattedIndicatorsInRow;

  const timeFormatedData = convertedData.map((d) => {
    return {
      ...d,
      date: parseDate(d.date),
    };
  });
  console.log('timeFormatedData', timeFormatedData);

  const ScaleProvider = discontinuousTimeScaleProviderBuilder();

  const { data: scaledData, xScale, xAccessor, displayXAccessor } = ScaleProvider(timeFormatedData);

  const yExtends = (d: T) => {
    return Object.keys(d).reduce(
      (acc, key) => {
        if (typeof d[key] !== 'number') return acc;
        return [Math.max(acc[0], parseInt(d[key])), Math.min(acc[1], parseInt(d[key]))];
      },
      [0, 0],
    );
  };

  console.log(displayXAccessor);
  console.log(scaledData);
  console.log('yExtends', scaledData.map(yExtends));
  console.log('xAccessor', scaledData.map(xAccessor));
  console.log('displayXAccessor', scaledData.map(displayXAccessor));
  console.log('xScale', xScale);

  const max = xAccessor(scaledData[scaledData.length - 1]);
  const min = xAccessor(scaledData[Math.max(0, scaledData.length - 100)]);
  const xExtents = [min, max + 5];

  return (
    <ChartCanvas
      xScale={xScale}
      // xExtents={xExtents}
      xAccessor={xAccessor}
      // Fix: 애가 작동을 안한다...
      displayXAccessor={(d) => {
        console.log('작동');
        return d.date;
      }}
      data={scaledData}
      width={600}
      height={300}
      seriesName="data"
      ratio={3}
    >
      <Chart id={1} height={100} yExtents={yExtends}>
        <XAxis showGridLines axisAt="bottom" orient="bottom" />
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
