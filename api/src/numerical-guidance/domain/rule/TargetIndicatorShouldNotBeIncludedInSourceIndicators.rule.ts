import { SourceIndicatorDtoType } from 'src/utils/type/type-definition';
import { BusinessRule } from '../../../utils/domain/business.rule';

export class TargetIndicatorShouldNotBeIncludedInSourceIndicatorsRule implements BusinessRule {
  constructor(
    private readonly sourceIndicatorInformation: SourceIndicatorDtoType[],
    private readonly targetIndicatorId: string,
  ) {}

  isBroken = () =>
    this.checkIsTargetIndicatorInSourceIndicators(this.sourceIndicatorInformation, this.targetIndicatorId);

  get Message() {
    return `타겟지표는 재료지표에 포함될 수 없습니다.`;
  }

  private checkIsTargetIndicatorInSourceIndicators(
    sourceIndicatorInformation: SourceIndicatorDtoType[],
    targetIndicatorId: string,
  ) {
    const sourceIndicatorIds: string[] = sourceIndicatorInformation.map((indicator) => {
      return indicator.id;
    });
    return sourceIndicatorIds.includes(targetIndicatorId);
  }
}
