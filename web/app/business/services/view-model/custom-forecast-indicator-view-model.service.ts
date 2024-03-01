import {
  CustomForecastIndicatorListResponse,
  CustomForecastIndicatorResponse,
  sourceIndicator,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';

export class CustomForecastIndicator {
  readonly id: string;
  readonly name: string;
  readonly targetIndicatorId: string;
  private sourceIndicatorIdsAndweights: sourceIndicator[];
  constructor({ id, name, targetIndicatorId, sourceIndicatorIdsAndweights }: CustomForecastIndicatorResponse) {
    this.id = id;
    this.name = name;
    this.targetIndicatorId = targetIndicatorId;
    this.sourceIndicatorIdsAndweights = sourceIndicatorIdsAndweights;
  }

  get sourceIndicatorIds() {
    return this.sourceIndicatorIdsAndweights.map((sourceIndicator) => sourceIndicator.id);
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

export const convertCustomForecastIndicatorViewModel = (customForecastIndicator: CustomForecastIndicatorResponse) => {
  return new CustomForecastIndicator(customForecastIndicator);
};
