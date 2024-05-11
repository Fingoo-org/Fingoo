import { SourceIndicatorInformation } from 'src/utils/type/type-definition';
import { BusinessRule } from '../../../utils/domain/business.rule';

export class SourceIndicatorsShouldNotDuplicateRule implements BusinessRule {
  constructor(private readonly sourceIndicatorIdsInformation: SourceIndicatorInformation[]) {}

  isBroken = () =>
    this.sourceIndicatorIdsInformation.length != this.indicatorIdsSet(this.sourceIndicatorIdsInformation).size;

  get Message() {
    return `예측지표를 만드는 데 필요한 재료지표는 중복될 수 없습니다.`;
  }

  private indicatorIdsSet(sourceIndicatorIdsAndWeights: SourceIndicatorInformation[]) {
    const sourceIndicatorIds: string[] = [];
    for (let i = 0; i < sourceIndicatorIdsAndWeights.length; i++) {
      sourceIndicatorIds.push(sourceIndicatorIdsAndWeights[i].sourceIndicatorId);
    }
    return new Set(sourceIndicatorIds);
  }
}
