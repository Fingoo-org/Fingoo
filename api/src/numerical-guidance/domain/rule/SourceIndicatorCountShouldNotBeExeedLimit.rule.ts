import { BusinessRule } from '../../../utils/domain/business.rule';

const INDICATOR_MAXIMUM = 10;

export class SourceIndicatorCountShouldNotExceedLimitRule implements BusinessRule {
  constructor(private readonly sourceIndicatorIds: any[]) {}

  isBroken = () => this.sourceIndicatorIds.length > INDICATOR_MAXIMUM;

  get Message() {
    return `재료지표 개수는 최대 ${INDICATOR_MAXIMUM}개입니다.`;
  }
}
