import {
  CustomForecastIndicatorListResponse,
  CustomForecastIndicatorResponse,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';

export class CustomForecastIndicator {
  readonly id: string;
  readonly name: string;
  readonly targetIndicatorId: string;
  readonly sourceIndicatorIds: string[];
  constructor({ id, name, targetIndicatorId, sourceIndicatorIds }: CustomForecastIndicatorResponse) {
    this.id = id;
    this.name = name;
    this.targetIndicatorId = targetIndicatorId;
    this.sourceIndicatorIds = sourceIndicatorIds;
  }
}

export class CustomForecastIndicators {
  readonly customForecastIndicatorList: CustomForecastIndicator[];
  constructor({ customForecastIndicatorList }: CustomForecastIndicatorListResponse) {
    this.customForecastIndicatorList = customForecastIndicatorList.map(
      (customForecastIndicator) => new CustomForecastIndicator(customForecastIndicator),
    );
  }
}

export const convertCustomForecastIndicatorsViewModel = (
  customForecastIndicatorList: CustomForecastIndicatorListResponse,
) => {
  return new CustomForecastIndicators(customForecastIndicatorList);
};
