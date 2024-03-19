import {
  CustomForecastIndicatorListResponse,
  CustomForecastIndicatorResponse,
  sourceIndicator,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';

export class CustomForecastIndicator {
  readonly id: string;
  readonly customForecastIndicatorName: string;
  readonly targetIndicatorId: string;
  private sourceIndicatorIdsAndWeights: sourceIndicator[];
  constructor({
    id,
    customForecastIndicatorName,
    targetIndicatorId,
    sourceIndicatorIdsAndWeights,
  }: CustomForecastIndicatorResponse) {
    this.id = id;
    this.customForecastIndicatorName = customForecastIndicatorName;
    this.targetIndicatorId = targetIndicatorId;
    this.sourceIndicatorIdsAndWeights = sourceIndicatorIdsAndWeights;
  }

  get sourceIndicatorIds() {
    return this.sourceIndicatorIdsAndWeights.map((sourceIndicator) => sourceIndicator.sourceIndicatorId);
  }

  get name() {
    return this.customForecastIndicatorName;
  }
}

export class CustomForecastIndicators {
  readonly customForecastIndicatorList: CustomForecastIndicator[];
  constructor(customForecastIndicatorList: CustomForecastIndicatorListResponse) {
    this.customForecastIndicatorList = customForecastIndicatorList.map(
      (customForecastIndicator) => new CustomForecastIndicator(customForecastIndicator),
    );
  }

  get length() {
    return this.customForecastIndicatorList.length;
  }

  findCustomForecastIndicatorById(id: string) {
    return this.customForecastIndicatorList.find((customForecastIndicator) => customForecastIndicator.id === id);
  }

  findCustomForecastIndicatorByIndex(index: number) {
    return this.customForecastIndicatorList[index];
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
