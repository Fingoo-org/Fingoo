import { BusinessRule } from '../../../utils/domain/business.rule';

export class IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule implements BusinessRule {
  constructor(private readonly tickers: Record<string, string[]>) {}

  isBroken = () =>
    Object.keys(this.tickers).some(
      (type) => this.tickers[type].toString().split(',').length != this.tickersSet(type).size,
    );

  get Message() {
    return `지표보드 메타데이터의 지표는 중복될 수 없습니다.`;
  }

  private tickersSet(type: string) {
    return new Set(this.tickers[type].toString().split(','));
  }
}
