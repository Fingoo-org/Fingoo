import { HistoryIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import {
  IndicatorValueItemResponse,
  IndicatorValueResponse,
  IndicatorsValueResponse,
} from '../../../store/querys/numerical-guidance/indicator.query';
import { utcFormat, utcParse } from 'd3-time-format';
const parseTime = utcParse('%Y%m%d');
const formatTime = utcFormat('%Y-%m-%d');

export type FormattedRowType = {
  [ticker: string]:
    | {
        value: number;
        displayValue: number;
      }
    | string;
};

type FormattedItem = {
  [date: string]: {
    [ticker: string]: {
      value: number;
      displayValue: number;
    };
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

type UnitType = 'index' | 'default';

type IndicatorValueViewModelType = {
  unitType: UnitType;
};

class IndicatorValue {
  readonly id: string;
  readonly ticker: string;
  readonly market: string;
  readonly type: string;
  readonly values: IndicatorValueItem[];
  private maxValue: number;
  private minValue: number;
  private unitType: UnitType;
  constructor({ id, ticker, market, type, values, unitType }: IndicatorValueResponse & IndicatorValueViewModelType) {
    this.id = id;
    this.ticker = ticker;
    this.market = market;
    this.type = type;
    this.values = values.map((item) => new IndicatorValueItem(item));
    this.maxValue = Math.max(...this.values.map((item) => item.parseValueToInt));
    this.minValue = Math.min(...this.values.map((item) => item.parseValueToInt));
    this.unitType = unitType;
  }

  get formattedItemsByDate(): FormattedItem {
    return this.values.reduce<FormattedItem>((acc, item) => {
      return {
        ...acc,
        [item.date]: {
          [this.ticker]: {
            value: this.caculateValue(item),
            displayValue: item.parseValueToInt,
          },
        },
      };
    }, {});
  }

  caculateValue(item: IndicatorValueItem) {
    return this.unitType === 'index' ? item.calcuateIndexValue(this.maxValue, this.minValue) : item.parseValueToInt;
  }
}

export class IndicatorsValue {
  readonly indicatorsValue: IndicatorValue[];
  constructor({ indicatorsValue }: IndicatorsValueResponse) {
    const unitType = indicatorsValue.length > 1 ? 'index' : 'default';
    this.indicatorsValue = indicatorsValue.map((indicatorValue) => new IndicatorValue({ ...indicatorValue, unitType }));
  }

  get length() {
    return this.indicatorsValue.length;
  }

  get formattedIndicatorsByDate() {
    return this.indicatorsValue.reduce<FormattedItem>((acc, indicator) => {
      const formattedItems = indicator.formattedItemsByDate;
      Object.keys(formattedItems).forEach((date) => {
        let formattedDate: string | Date = new Date(date);
        if (formattedDate.toString().startsWith('Invalid')) {
          formattedDate = parseTime(date) ?? new Date(date);
        }
        formattedDate = formatTime(formattedDate);

        acc[formattedDate] = { ...acc[formattedDate], ...formattedItems[date] };
      });
      return acc;
    }, {});
  }

  get formattedIndicatorsInRow() {
    const formattedIndicatorsByDate = this.formattedIndicatorsByDate;
    return Object.keys(formattedIndicatorsByDate).map<{
      [ticker: string]:
        | {
            value: number;
            displayValue: number;
          }
        | string;
    }>((date) => {
      return {
        date,
        ...formattedIndicatorsByDate[date],
      };
    });
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
