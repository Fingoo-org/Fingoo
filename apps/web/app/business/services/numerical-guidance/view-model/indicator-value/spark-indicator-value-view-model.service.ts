import { IndicatorValueResponse } from '@/app/store/querys/numerical-guidance/indicator-value.query';
import { ActualIndicatorValue } from './actual-indicators-value-view-model.service';
import { GeometricSeriesCalculator } from '../../chart/linear-regression/geometric-series-calculator.service';

export class SparkIndicatorValue extends ActualIndicatorValue {
  readonly weight: number;

  constructor({ indicatorId, symbol, type, values, weight }: IndicatorValueResponse & { weight: number }) {
    const lastValue = values[values.length - 1];
    const geometricSeriesCalculator = new GeometricSeriesCalculator({
      startPoint: {
        date: lastValue.date,
        value: typeof lastValue.value === 'number' ? lastValue.value : parseInt(lastValue.value),
      },
    });
    const geometricValues = geometricSeriesCalculator.calculate(15, weight);
    const newValues = [...values, ...geometricValues];

    super({ indicatorId, symbol, type, values: newValues });
    this.weight = weight;
  }
}
