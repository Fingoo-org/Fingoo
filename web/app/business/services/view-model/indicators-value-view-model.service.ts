import { HistoryIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import {
  IndicatorValueItemResponse,
  IndicatorValueResponse,
  IndicatorsValueResponse,
} from '../../../store/querys/numerical-guidance/indicator.query';
import { utcFormat, utcParse } from 'd3-time-format';
const parseTime = utcParse('%Y%m%d');
const formatTime = utcFormat('%Y-%m-%d');

type formattedItem = {
  [date: string]: {
    [ticker: string]: number;
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
}

class IndicatorValue {
  readonly id: string;
  readonly ticker: string;
  readonly market: string;
  readonly type: string;
  readonly values: IndicatorValueItem[];
  constructor({ id, ticker, market, type, values }: IndicatorValueResponse) {
    this.id = id;
    this.ticker = ticker;
    this.market = market;
    this.type = type;
    this.values = values.map((item) => new IndicatorValueItem(item));
  }

  get formattedItemsByDate(): formattedItem {
    return this.values.reduce((acc, item) => {
      return {
        ...acc,
        [item.date]: {
          // temp: history 단위가 이상해서 일단 처리
          [this.ticker]: typeof item.value === 'number' ? item.value : parseInt(item.value.slice(0, 2)),
          // 여기에 display value 추가하는게 맞을 듯
        },
      };
    }, {});
  }
}

export class IndicatorsValue {
  readonly indicatorsValue: IndicatorValue[];
  constructor({ indicatorsValue }: IndicatorsValueResponse) {
    this.indicatorsValue = indicatorsValue.map((indicatorValue) => new IndicatorValue(indicatorValue));
  }

  get length() {
    return this.indicatorsValue.length;
  }

  get formattedIndicatorsByDate() {
    return this.indicatorsValue.reduce((acc: formattedItem, indicator) => {
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
    return Object.keys(formattedIndicatorsByDate).map((date) => {
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
