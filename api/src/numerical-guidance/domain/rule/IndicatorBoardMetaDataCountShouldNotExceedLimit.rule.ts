import { BusinessRule } from '../../../utils/domain/business.rule';

const INDICATOR_KEY_MAXIMUM = 5;

export class IndicatorBoardMetaDataCountShouldNotExceedLimitRule implements BusinessRule {
  constructor(private readonly tickers: Record<string, string[]>) {}

  isBroken = () => this.indicatorIds[Object.keys(this.indicatorIds)[0]]?.length > INDICATOR_KEY_MAXIMUM;

  get Message() {
    return `지표보드 메타데이터의 개수는 최대 ${INDICATOR_KEY_MAXIMUM}개입니다.`;
  }
}
