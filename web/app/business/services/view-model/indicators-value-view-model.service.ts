import { HistoryIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import {
  IndicatorValueItemResponse,
  IndicatorValueResponse,
  IndicatorsValueResponse,
} from '../../../store/querys/numerical-guidance/indicator.query';
import { CustomForecastIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';

export type FormattedIndicatorValue = {
  value: number;
  displayValue: number;
};

export type FormattedRowType = {
  [ticker: string]: FormattedIndicatorValue | string;
};

export type FormattedItem = {
  [date: string]: {
    [ticker: string]: FormattedIndicatorValue;
  };
};

// Risk: item이 길어지면 오버헤드
class IndicatorValueItem {
  readonly date: string;
  readonly value: number | string;
  constructor({ date, value }: IndicatorValueItemResponse) {
    this.date = date;
    this.value = value;
  }

  calcuateIndexValue(maxValue: number, minValue: number) {
    if (typeof this.value === 'number') {
      return ((this.value - minValue) / (maxValue - minValue)) * 100;
    } else {
      return ((parseInt(this.value) - minValue) / (maxValue - minValue)) * 100;
    }
  }

  get parseValueToInt() {
    return typeof this.value === 'number' ? this.value : parseInt(this.value);
  }
}

export type UnitType = 'index' | 'default';

export class IndicatorValue {
  readonly id: string;
  readonly ticker: string;
  readonly market: string;
  readonly type: string;
  readonly values: IndicatorValueItem[];
  private maxValue: number;
  private minValue: number;
  constructor({ id, ticker, market, type, values }: IndicatorValueResponse) {
    this.id = id;
    this.ticker = ticker;
    this.market = market;
    this.type = type;
    this.values = values.map((item) => new IndicatorValueItem(item));
    this.maxValue = Math.max(...this.values.map((item) => item.parseValueToInt));
    this.minValue = Math.min(...this.values.map((item) => item.parseValueToInt));
  }

  formattedItemsByDate({ unitType }: { unitType: UnitType }): FormattedItem {
    return this.values.reduce<FormattedItem>((acc, item) => {
      return {
        ...acc,
        [item.date]: {
          [this.ticker]: {
            value: this.caculateValue(item, unitType),
            displayValue: item.parseValueToInt,
          },
        },
      };
    }, {});
  }

  caculateValue(item: IndicatorValueItem, unitType: UnitType) {
    return unitType === 'index' ? item.calcuateIndexValue(this.maxValue, this.minValue) : item.parseValueToInt;
  }
}

export class IndicatorsValue {
  readonly indicatorsValue: IndicatorValue[];
  constructor({ indicatorsValue }: IndicatorsValueResponse) {
    this.indicatorsValue = indicatorsValue.map((indicatorValue) => new IndicatorValue({ ...indicatorValue }));
  }

  get length() {
    return this.indicatorsValue.length;
  }

  get tickerList() {
    return this.indicatorsValue.map((indicator) => indicator.ticker);
  }
}

export const convertLiveIndicatorsValueViewModel = (indicators: IndicatorsValueResponse) => {
  return new IndicatorsValue(indicators);
};

export const convertHistoryIndicatorsValueViewModel = (indicators: HistoryIndicatorValueResponse[]) => {
  const formmatedIndicators = indicators.map((indicator) => {
    return {
      ...indicator.indicator,
      values: indicator.values,
    };
  });

  return new IndicatorsValue({
    indicatorsValue: formmatedIndicators,
  });
};

export const convertCustomForecastTargetIndicatorsValueViewModel = (
  indicators: CustomForecastIndicatorValueResponse[],
) => {
  const formmatedIndicators = indicators.map((indicator) => {
    return {
      id: indicator.targetIndicatorId,
      ticker: indicator.ticker,
      market: indicator.market,
      type: indicator.type,
      values: indicator.targetIndicatorValues,
    };
  });

  return new IndicatorsValue({
    indicatorsValue: formmatedIndicators,
  });
};
