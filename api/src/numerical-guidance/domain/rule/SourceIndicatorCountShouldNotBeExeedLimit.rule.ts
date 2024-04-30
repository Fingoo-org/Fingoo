import { BusinessRule } from '../../../utils/domain/business.rule';
import { SourceIndicatorInformation } from 'src/utils/type/type-definition';

const INDICATOR_MAXIMUM = 10;

export class SourceIndicatorCountShouldNotExceedLimitRule implements BusinessRule {
  constructor(private readonly sourceIndicatorIds: SourceIndicatorInformation[]) {}

  isBroken = () => this.sourceIndicatorIds.length > INDICATOR_MAXIMUM;

  get Message() {
    return `재료지표 개수는 최대 ${INDICATOR_MAXIMUM}개입니다.`;
  }
}
