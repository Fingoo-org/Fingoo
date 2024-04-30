import { BusinessRule } from '../../../utils/domain/business.rule';
import { SourceIndicatorInformation } from 'src/utils/type/type-definition';

export class TargetIndicatorShouldNotBeIncludedInSourceIndicatorsRule implements BusinessRule {
  constructor(
    private readonly sourceIndicatorInformation: SourceIndicatorInformation[],
    private readonly targetIndicatorId: string,
  ) {}

  isBroken = () =>
    this.checkIsTargetIndicatorInSourceIndicators(this.sourceIndicatorInformation, this.targetIndicatorId);

  get Message() {
    return `타겟지표는 재료지표에 포함될 수 없습니다.`;
  }

  private checkIsTargetIndicatorInSourceIndicators(
    sourceIndicatorInformation: SourceIndicatorInformation[],
    targetIndicatorId: string,
  ) {
    const sourceIndicatorIds: string[] = sourceIndicatorInformation.map((indicatorId) => {
      return indicatorId.sourceIndicatorId;
    });
    return sourceIndicatorIds.includes(targetIndicatorId);
  }
}
