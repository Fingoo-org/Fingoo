import { BusinessRule } from '../../../utils/domain/business.rule';

const INDICATOR_MAXIMUM = 5;

export class IndicatorBoardMetadataCountShouldNotExceedLimitRule implements BusinessRule {
  constructor(private readonly indicatorIds: string[]) {}

  isBroken = () => this.indicatorIds.length > INDICATOR_MAXIMUM;

  get Message() {
    return `지표보드 메타데이터의 개수는 최대 ${INDICATOR_MAXIMUM}개입니다.`;
  }
}
