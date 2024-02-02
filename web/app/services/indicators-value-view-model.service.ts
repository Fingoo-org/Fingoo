import {
  IndicatorValueItemResponse,
  IndicatorValueResponse,
  IndicatorsValueResponse,
} from '../querys/numerical-guidance/indicator.query';

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
  readonly ticker: string;
  readonly items: IndicatorValueItem[];
  constructor({ ticker, items }: IndicatorValueResponse) {
    this.ticker = ticker;
    this.items = items.map((item) => new IndicatorValueItem(item));
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
}

export const convertIndicatorsValueViewModel = (indicators: IndicatorsValueResponse) => {
  return new IndicatorsValue(indicators);
};
