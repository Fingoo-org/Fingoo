import { BusinessRule } from '../../../utils/domain/business.rule';
import { SourceIndicatorIdAndWeightType } from 'src/utils/type/type-definition';

export class TargetIndicatorShouldNotBeIncludedInSourceIndicatorsRule implements BusinessRule {
  constructor(
    private readonly sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[],
    private readonly targetIndicatorId: string,
  ) {}

  isBroken = () =>
    this.checkIsTargetIndicatorInSourceIndicators(this.sourceIndicatorIdsAndWeights, this.targetIndicatorId);

  get Message() {
    return `타겟지표는 재료지표에 포함될 수 없습니다.`;
  }

  private checkIsTargetIndicatorInSourceIndicators(
    sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[],
    targetIndicatorId: string,
  ) {
    const sourceIndicatorIds: string[] = sourceIndicatorIdsAndWeights.map((indicatorId) => {
      return indicatorId.sourceIndicatorId;
    });
    return sourceIndicatorIds.includes(targetIndicatorId);
  }
}
