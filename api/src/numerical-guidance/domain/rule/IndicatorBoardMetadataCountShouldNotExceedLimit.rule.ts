import { BusinessRule } from '../../../utils/domain/business.rule';

const INDICATOR_KEY_MAXIMUM = 5;

export class IndicatorBoardMetadataCountShouldNotExceedLimitRule implements BusinessRule {
  constructor(private readonly tickers: Record<string, string[]>) {}

  isBroken = () =>
    Object.keys(this.tickers)
      .map((type) => this.tickers[type].toString().split(',').length)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0) > INDICATOR_KEY_MAXIMUM;

  get Message() {
    return `지표보드 메타데이터의 개수는 최대 ${INDICATOR_KEY_MAXIMUM}개입니다.`;
  }
}
