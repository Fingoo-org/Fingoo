import {
  CustomForecastIndicatorResponse,
  CustomForecastIndicatorValueResponse,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { FormattedItem, IndicatorValue, IndicatorValueItem, UnitType } from './indicator-value-view-model.service';
import { HistoryIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';

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
    const mergedValueItems = [...targetIndicatorValueItems, ...customForecastIndicatorValueItems];
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

export const convertCustomForecastHistoryIndicatorsValueViewModel = (
  customForecastHistoryIndicatorsValue: HistoryIndicatorValueResponse[],
  selectedCustomForeacastIndicators: CustomForecastIndicatorResponse[],
) => {
  let memorizedCustomForecastIndicators = [...selectedCustomForeacastIndicators];
  return customForecastHistoryIndicatorsValue.reduce<CustomForecastIndicatorValue[]>((acc, item) => {
    const index = memorizedCustomForecastIndicators.findIndex(
      (customForecastIndicator) => customForecastIndicator.targetIndicatorId === item.indicator.id,
    );

    if (index === -1) return acc;
    const customForecastIndicator = memorizedCustomForecastIndicators[index];
    memorizedCustomForecastIndicators.splice(index, 1);

    return [
      ...acc,
      new CustomForecastIndicatorValue({
        customForecastIndicatorId: customForecastIndicator.id,
        targetIndicatorId: customForecastIndicator.targetIndicatorId,
        ticker: item.indicator.ticker,
        market: item.indicator.market,
        type: item.indicator.type,
        customForecastIndicatorName: customForecastIndicator.customForecastIndicatorName,
        customForecastIndicatorValues: [],
        targetIndicatorValues: item.values,
        name: item.indicator.name,
      }),
    ];
  }, []);
};
