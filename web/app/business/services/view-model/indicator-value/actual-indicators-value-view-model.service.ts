import { HistoryIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import {
  IndicatorValueResponse,
  IndicatorsValueResponse,
} from '../../../../store/querys/numerical-guidance/indicator.query';
import { IndicatorValueItem, IndicatorValue, FormattedItem, UnitType } from './indicator-value-view-model.service';
import { IndexUnitCalculator } from '../../chart/unit-calculator/index-unit-calculator.service';
import { DefaultUnitCalculator } from '../../chart/unit-calculator/default-unit-calculator.service';

export class ActualIndicatorValue extends IndicatorValue {
  readonly indicatorId: string;
  readonly ticker: string;
  readonly market: string;
  readonly type: string;
  readonly values: IndicatorValueItem[];
  constructor({ indicatorId, ticker, market, type, values }: IndicatorValueResponse) {
    super(indicatorId);
    this.indicatorId = indicatorId;
    this.ticker = ticker;
    this.market = market;
    this.type = type;
    this.values = values.map((item) => new IndicatorValueItem(item));
  }

  formattedItemsValue({ unitType }: { unitType: UnitType }) {
    const caculator =
      unitType === 'index' ? new IndexUnitCalculator(this.values) : new DefaultUnitCalculator(this.values);

    return caculator.caculate();
  }

  formattedItemsByDate({ unitType }: { unitType: UnitType }): FormattedItem {
    return this.formattedItemsValue({ unitType }).reduce<FormattedItem>((acc, item) => {
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
