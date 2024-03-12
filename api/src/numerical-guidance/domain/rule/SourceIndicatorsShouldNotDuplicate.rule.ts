import { SourceIndicatorIdAndWeightType } from 'src/utils/type/type-definition';
import { BusinessRule } from '../../../utils/domain/business.rule';

export class SourceIndicatorsShouldNotDuplicateRule implements BusinessRule {
  constructor(private readonly sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[]) {}

  isBroken = () =>
    this.sourceIndicatorIdsAndWeights.length != this.indicatorIdsSet(this.sourceIndicatorIdsAndWeights).size;

  get Message() {
    return `예측지표를 만드는 데 필요한 재료지표는 중복될 수 없습니다.`;
  }

  private indicatorIdsSet(sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[]) {
    const sourceIndicatorIds: string[] = [];
    for (let i = 0; i < sourceIndicatorIdsAndWeights.length; i++) {
      sourceIndicatorIds.push(sourceIndicatorIdsAndWeights[i].sourceIndicatorId);
    }
    return new Set(sourceIndicatorIds);
  }
}
