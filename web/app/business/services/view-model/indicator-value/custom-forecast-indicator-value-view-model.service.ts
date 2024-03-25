import { CustomForecastIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { FormattedItem, IndicatorValue, IndicatorValueItem, UnitType } from './indicator-value-view-model.service';

type CustomForecastIndicator = {
  customForecastIndicatorName: string;
};

export class CustomForecastIndicatorValue extends IndicatorValue {
  readonly customForecastIndicatorId: string;
  readonly targetIndicatorId: string;
  readonly ticker: string;
  readonly market: string;
  readonly type: string;
  readonly customForecastIndicatorValues: IndicatorValueItem[];
  readonly customForecastIndicatorName: string;
  readonly targetIndicatorValues: IndicatorValueItem[];
  private mergedValues: IndicatorValueItem[];

  constructor({
    customForecastIndicatorId,
    targetIndicatorId,
    ticker,
    market,
    type,
    customForecastIndicatorName,
    customForecastIndicatorValues,
    targetIndicatorValues,
  }: CustomForecastIndicatorValueResponse & CustomForecastIndicator) {
    const customForecastIndicatorValueItems = customForecastIndicatorValues.map((item) => new IndicatorValueItem(item));
    const targetIndicatorValueItems = targetIndicatorValues.map((item) => new IndicatorValueItem(item));
    const mergedValueItems = [...customForecastIndicatorValueItems, ...targetIndicatorValueItems];
    super(
      Math.max(...mergedValueItems.map((item) => item.parseValueToInt)),
      Math.min(...mergedValueItems.map((item) => item.parseValueToInt)),
    );
    this.customForecastIndicatorId = customForecastIndicatorId;
    this.targetIndicatorId = targetIndicatorId;
    this.ticker = ticker;
    this.market = market;
    this.type = type;
    this.customForecastIndicatorName = customForecastIndicatorName;
    this.customForecastIndicatorValues = customForecastIndicatorValueItems;
    this.targetIndicatorValues = targetIndicatorValueItems;
    this.mergedValues = mergedValueItems;
  }

  formattedItemsByDate({ unitType }: { unitType: UnitType }): FormattedItem {
    return this.mergedValues.reduce<FormattedItem>((acc, item) => {
      return {
        ...acc,
        [item.date]: {
          [this.customForecastIndicatorName]: {
            value: this.caculateValue(item, unitType),
            displayValue: item.parseValueToInt,
          },
        },
      };
    }, {});
  }

  get identifier() {
    return this.customForecastIndicatorName;
  }
}

export const convertCustomForecastIndicatorsValue = (
  customForecastIndicatorsValue: (CustomForecastIndicatorValueResponse & { customForecastIndicatorName: string })[],
) => {
  return customForecastIndicatorsValue.map((item) => new CustomForecastIndicatorValue(item));
};
