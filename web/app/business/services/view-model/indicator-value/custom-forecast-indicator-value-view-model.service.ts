import {
  CustomForecastIndicatorResponse,
  CustomForecastIndicatorValueResponse,
  ForecastType,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { FormattedItem, IndicatorValue, IndicatorValueItem, UnitType } from './indicator-value-view-model.service';
import { HistoryIndicatorValueResponse } from '@/app/store/querys/numerical-guidance/history-indicator.query';
import { DefaultUnitCalculator } from '../../chart/unit-calculator/default-unit-calculator.service';
import { IndexUnitCalculator } from '../../chart/unit-calculator/index-unit-calculator.service';

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
  readonly forecastType: ForecastType;
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
    forecastType,
  }: CustomForecastIndicatorValueResponse & CustomForecastIndicator) {
    const customForecastIndicatorValueItems = customForecastIndicatorValues.map((item) => new IndicatorValueItem(item));
    const targetIndicatorValueItems = targetIndicatorValues.map((item) => new IndicatorValueItem(item));
    const mergedValueItems = [...targetIndicatorValueItems, ...customForecastIndicatorValueItems];
    super(customForecastIndicatorId);
    this.customForecastIndicatorId = customForecastIndicatorId;
    this.targetIndicatorId = targetIndicatorId;
    this.ticker = ticker;
    this.market = market;
    this.type = type;
    this.customForecastIndicatorName = customForecastIndicatorName;
    this.customForecastIndicatorValues = customForecastIndicatorValueItems;
    this.targetIndicatorValues = targetIndicatorValueItems;
    this.forecastType = forecastType;
    this.mergedValues = mergedValueItems;
  }

  caculateItemsValue({ unitType }: { unitType: UnitType }) {
    const caculator =
      unitType === 'index' ? new IndexUnitCalculator(this.mergedValues) : new DefaultUnitCalculator(this.mergedValues);

    return caculator.caculate();
  }

  formattedItemsByDate({ unitType }: { unitType: UnitType }): FormattedItem {
    return this.caculateItemsValue({ unitType }).reduce<FormattedItem>((acc, item) => {
      return {
        ...acc,
        [item.date]: {
          [this.customForecastIndicatorName]: {
            value: item.value,
            displayValue: item.displayValue,
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
        forecastType: 'multi',
      }),
    ];
  }, []);
};
