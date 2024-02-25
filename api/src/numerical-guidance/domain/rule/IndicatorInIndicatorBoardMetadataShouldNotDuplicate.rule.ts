import { BusinessRule } from '../../../utils/domain/business.rule';

export class IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule implements BusinessRule {
  constructor(private readonly indicatorIds: string[]) {}

  isBroken = () => this.indicatorIds.length != this.indicatorIdsSet(this.indicatorIds).size;

  get Message() {
    return `지표보드 메타데이터의 지표는 중복될 수 없습니다.`;
  }

  private indicatorIdsSet(indicatorIds: string[]) {
    return new Set(indicatorIds);
  }
}
