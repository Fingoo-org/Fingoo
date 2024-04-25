import { HistoryIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import {
  IndicatorValueResponse,
  IndicatorsValueResponse,
} from '../../../../store/querys/numerical-guidance/indicator.query';
import {
  IndicatorValueItem,
  IndicatorValue,
  FormattedItem,
  CaculatedItem,
  FormatOptions,
} from './indicator-value-view-model.service';
import { createUnitCalculator } from '../../chart/unit-calculator/unit-calculator-factory.service';

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

  caculateItemsValue(isValueWithIndexUnit: boolean): CaculatedItem[] {
    const caculatedDisplayValues = createUnitCalculator(this.values, this._unitType).caculate();

    const caculatedValues = isValueWithIndexUnit
      ? createUnitCalculator(caculatedDisplayValues, 'index').caculate()
      : caculatedDisplayValues;

    return caculatedDisplayValues.map((item, index) => {
      const value = caculatedValues[index].value;
      return {
        date: item.date,
        value: value,
        displayValue: item.value,
      };
    });
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
