import {
  CustomForecastIndicatorListResponse,
  CustomForecastIndicatorResponse,
  TargetIndicatorInfo,
  VerificationType,
  sourceIndicator,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { IndicatorByTypeResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { createIndicator } from './indicator-list/indicator-view-model.service';

export class CustomForecastIndicator {
  readonly id: string;
  readonly customForecastIndicatorName: string;
  readonly targetIndicator: IndicatorByTypeResponse;
  readonly sourceIndicatorsInformation: sourceIndicator[];
  readonly type: IndicatorType;
  readonly grangerVerification: VerificationType[];
  readonly cointJohansenVerification: VerificationType[];
  constructor({
    id,
    customForecastIndicatorName,
    targetIndicator,
    sourceIndicatorsInformation,
    type,
    grangerVerification,
    cointJohansenVerification,
  }: CustomForecastIndicatorResponse) {
    this.id = id;
    this.customForecastIndicatorName = customForecastIndicatorName;
    this.targetIndicator = targetIndicator;
    this.sourceIndicatorsInformation = sourceIndicatorsInformation;
    this.type = type;
    this.grangerVerification = grangerVerification;
    this.cointJohansenVerification = cointJohansenVerification;
  }

  get sourceIndicatorIds() {
    return this.sourceIndicatorsInformation.map((sourceIndicator) => sourceIndicator.sourceIndicatorId);
  }

  get targetIndicatorId() {
    return this.targetIndicator.id;
  }

  get name() {
    return this.customForecastIndicatorName;
  }

  get targetIndicatorInfo() {
    return createIndicator(this.targetIndicator);
  }

  getSourceIndicatorWeight(sourceIndicatorId: string) {
    const sourceIndicator = this.sourceIndicatorsInformation.find(
      (sourceIndicator) => sourceIndicator.sourceIndicatorId === sourceIndicatorId,
    );
    return sourceIndicator?.weight;
  }

  checkGrantedVerificationBySourceIndicatorId(sourceIndicatorId: string) {
    const grangerVerification = this.grangerVerification.find((item) => {
      return item.indicatorId === sourceIndicatorId;
    });

    if (!grangerVerification) return true;

    return grangerVerification.verification === 'True';
  }

  get formattedCustomForecastIndicator(): CustomForecastIndicatorResponse {
    return {
      id: this.id,
      customForecastIndicatorName: this.customForecastIndicatorName,
      targetIndicator: this.targetIndicator,
      sourceIndicatorsInformation: this.sourceIndicatorsInformation,
      type: this.type,
      grangerVerification: this.grangerVerification,
      cointJohansenVerification: this.cointJohansenVerification,
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
