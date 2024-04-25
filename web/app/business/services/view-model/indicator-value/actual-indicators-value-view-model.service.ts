import { HistoryIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import {
  IndicatorValueResponse,
  IndicatorsValueResponse,
} from '../../../../store/querys/numerical-guidance/indicator.query';
import { IndicatorValueItem, IndicatorValue, FormattedItem, FormatOptions } from './indicator-value-view-model.service';

export class ActualIndicatorValue extends IndicatorValue {
  readonly indicatorId: string;
  readonly ticker: string;
  readonly market: string;
  readonly type: string;
  constructor({ indicatorId, ticker, market, type, values }: IndicatorValueResponse) {
    super(
      indicatorId,
      values.map((item) => new IndicatorValueItem(item)),
    );
    this.indicatorId = indicatorId;
    this.ticker = ticker;
    this.market = market;
    this.type = type;
  }

  formatItemsByDate(options?: FormatOptions): FormattedItem {
    const { isValueWithIndexUnit } = options || { isValueWithIndexUnit: false };
    return this.caculateItemsValue(isValueWithIndexUnit ?? false).reduce<FormattedItem>((acc, item) => {
      return {
        ...acc,
        [item.date]: {
          [this.ticker]: {
            value: item.value,
            displayValue: item.displayValue,
          },
        },
      };
    }, {});
  }

  get identifier() {
    return this.ticker;
  }
}

export class ActualIndicatorsValue {
  readonly indicatorsValue: ActualIndicatorValue[];
  constructor({ indicatorsValue }: IndicatorsValueResponse) {
    this.indicatorsValue = indicatorsValue.map((indicatorValue) => new ActualIndicatorValue({ ...indicatorValue }));
  }

  get length() {
    return this.indicatorsValue.length;
  }

  get tickerList() {
    return this.indicatorsValue.map((indicator) => indicator.ticker);
  }
}

export const convertLiveIndicatorsValueViewModel = (indicators: IndicatorsValueResponse) => {
  return new ActualIndicatorsValue(indicators);
};

export const convertHistoryIndicatorsValueViewModel = (indicators: HistoryIndicatorValueResponse[]) => {
  const formmatedIndicators = indicators.map((indicator) => {
    return {
      ...indicator.indicator,
      values: indicator.values,
      indicatorId: indicator.indicator.id,
    };
  });

  return new ActualIndicatorsValue({
    indicatorsValue: formmatedIndicators,
  });
};
