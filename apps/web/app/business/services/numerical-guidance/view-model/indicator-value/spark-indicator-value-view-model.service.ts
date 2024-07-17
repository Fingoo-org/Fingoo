import { IndicatorValueResponse } from '@/app/store/querys/numerical-guidance/indicator-value.query';
import { ActualIndicatorValue } from './actual-indicators-value-view-model.service';
import { GeometricSeriesCalculator } from '../../chart/linear-regression/geometric-series-calculator.service';
import { getNowDate } from '@/app/utils/date-formatter';

type SparkIndicatorProps = IndicatorValueResponse & { weight: number };

export class SparkIndicatorValue extends ActualIndicatorValue {
  readonly weight: number;

  constructor({ indicatorId, symbol, type, values, weight }: SparkIndicatorProps) {
    const lastValue = values[0].value;

    const geometricValues = SparkIndicatorValue.createGeometricValues(lastValue, weight);

    const newValues = [...geometricValues.reverse(), ...values];

    super({ indicatorId, symbol, type, values: newValues });
    this.weight = weight;
  }

  static createGeometricValues(value: number | string, weight: number) {
    const geometricSeriesCalculator = new GeometricSeriesCalculator({
      startPoint: {
        date: getNowDate(),
        value: typeof value === 'number' ? value : parseFloat(value),
      },
    });
    return geometricSeriesCalculator.calculate(15, weight);
  }
}

export class SparkIndicatorsValue {
  readonly indicatorsValue: SparkIndicatorValue[];

  constructor(indicatorsValue: SparkIndicatorProps[]) {
    this.indicatorsValue = indicatorsValue.map((indicatorValue) => new SparkIndicatorValue({ ...indicatorValue }));
  }

  get length() {
    return this.indicatorsValue.length;
  }

  get symbolList() {
    return this.indicatorsValue.map((indicator) => indicator.symbol);
  }
}

export const convertSparkIndicatorsValueViewModel = (indicators: SparkIndicatorProps[]) => {
  return new SparkIndicatorsValue(indicators);
};
