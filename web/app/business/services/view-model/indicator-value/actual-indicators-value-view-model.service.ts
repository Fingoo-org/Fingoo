import { HistoryIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import {
  IndicatorValueResponse,
  IndicatorsValueResponse,
} from '../../../../store/querys/numerical-guidance/indicator.query';
import { CustomForecastIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { IndicatorValueItem, IndicatorValue } from './indicator-value-view-model.service';

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

export type UnitType = 'index' | 'default';

export class ActualIndicatorValue extends IndicatorValue {
  readonly id: string;
  readonly ticker: string;
  readonly market: string;
  readonly type: string;
  readonly values: IndicatorValueItem[];
  constructor({ id, ticker, market, type, values }: IndicatorValueResponse) {
    const valueItems = values.map((item) => new IndicatorValueItem(item));
    super(
      Math.max(...valueItems.map((item) => item.parseValueToInt)),
      Math.min(...valueItems.map((item) => item.parseValueToInt)),
    );
    this.id = id;
    this.ticker = ticker;
    this.market = market;
    this.type = type;
    this.values = values.map((item) => new IndicatorValueItem(item));
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
    };
  });

  return new ActualIndicatorsValue({
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

  return new ActualIndicatorsValue({
    indicatorsValue: formmatedIndicators,
  });
};
