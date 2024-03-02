import {
  IndicatorValueItemResponse,
  IndicatorValueResponse,
  IndicatorsValueResponse,
} from '../../../store/querys/numerical-guidance/indicator.query';

type formattedItem = {
  [key: string]: {
    [key: string]: number;
  };
};

// Risk: item이 길어지면 오버헤드
class IndicatorValueItem {
  readonly date: string;
  readonly value: number;
  constructor({ date, value }: IndicatorValueItemResponse) {
    this.date = date;
    this.value = value;
  }
}

class IndicatorValue {
  readonly id: string;
  readonly ticker: string;
  readonly values: IndicatorValueItem[];
  constructor({ id, ticker, values }: IndicatorValueResponse) {
    this.id = id;
    this.ticker = ticker;
    this.values = values.map((item) => new IndicatorValueItem(item));
  }

  get formattedItemsByDate(): Record<string, formattedItem> {
    return this.values.reduce((acc, item) => {
      return {
        ...acc,
        [item.date]: {
          [this.ticker]: item.value,
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
    return this.indicatorsValue.reduce((acc: Record<string, formattedItem>, indicator) => {
      const formattedItems = indicator.formattedItemsByDate;
      Object.keys(formattedItems).forEach((date) => {
        acc[date] = { ...acc[date], ...formattedItems[date] };
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

export const convertIndicatorsValueViewModel = (indicators: IndicatorsValueResponse) => {
  return new IndicatorsValue(indicators);
};
