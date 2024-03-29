import {
  CustomForecastIndicatorListResponse,
  CustomForecastIndicatorResponse,
  sourceIndicator,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';

export class CustomForecastIndicator {
  readonly id: string;
  readonly customForecastIndicatorName: string;
  readonly targetIndicatorId: string;
  readonly sourceIndicatorIdsAndWeights: sourceIndicator[];
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

  getSourceIndicatorWeight(sourceIndicatorId: string) {
    const sourceIndicator = this.sourceIndicatorIdsAndWeights.find(
      (sourceIndicator) => sourceIndicator.sourceIndicatorId === sourceIndicatorId,
    );
    return sourceIndicator?.weight;
  }

  get formattedCustomForecastIndicator(): CustomForecastIndicatorResponse {
    return {
      id: this.id,
      customForecastIndicatorName: this.customForecastIndicatorName,
      targetIndicatorId: this.targetIndicatorId,
      sourceIndicatorIdsAndWeights: this.sourceIndicatorIdsAndWeights,
    };
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
  deleteCustomForecastIndicatorById(id: string) {
    const index = this.customForecastIndicatorList.findIndex(
      (customForecastIndicator) => customForecastIndicator.id === id,
    );
    if (index === -1) return;

    this.customForecastIndicatorList.splice(index, 1);
  }

  get formattedCustomForecastIndicatorList() {
    return this.customForecastIndicatorList.map(
      (customForecastIndicator) => customForecastIndicator.formattedCustomForecastIndicator,
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
